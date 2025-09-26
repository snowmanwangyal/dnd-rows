import {
  closestCenter,
  DndContext,
  DragOverlay,
  getFirstCollision,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Stack, useMantineTheme, type MantineNumberSize } from "@mantine/core";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
  createHorizontalAboveIndicatorId,
  createHorizontalBelowIndicatorId,
  createLeftIndicatorId,
  createRightIndicatorId,
  INDICATOR_WIDTH_PX,
  isHorizontalIndicator,
  isIndicator,
  isVerticalIndicator,
  MAX_ITEMS_PER_ROW,
  MIN_ITEM_WIDTH_PERCENTAGE,
  parseIndicatorId,
} from "./constants";
import { DnDItemV2 } from "./DnDItemV2";
import { DnDSortableItemV2 } from "./DnDSortableItemV2";
import { DnDSortableRowV2 } from "./DnDSortableRowV2";
import type { 
  DnDItem, 
  DnDLayoutItemV2, 
  HorizontalIndicatorState, 
  IndicatorHoverState, 
  RenderItemArgs, 
  ResizeState 
} from "./types";

// Utility functions
const createItemsById = <T,>(items: DnDItem<T>[]): Record<string, DnDItem<T>> =>
  items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, DnDItem<T>>);

const createRowIds = (layout: Record<string, DnDLayoutItemV2>): string[] => {
  const uniqueRows = Array.from(
    new Set(Object.values(layout).map((item) => item.row.toString()))
  );
  return uniqueRows.sort((a, b) => parseInt(a) - parseInt(b));
};

const createItemsByRowId = <T,>(
  items: DnDItem<T>[],
  layout: Record<string, DnDLayoutItemV2>,
  rowIds: string[]
): Record<string, DnDItem<T>[]> => {
  const rowGroups: Record<string, DnDItem<T>[]> = {};

  rowIds.forEach((rowID) => {
    rowGroups[rowID] = [];
  });

  Object.entries(layout).forEach(([itemId, layoutItem]) => {
    const rowKey = layoutItem.row.toString();
    const item = items.find((currentItem) => currentItem.id === itemId);
    if (item && rowGroups[rowKey]) {
      rowGroups[rowKey][layoutItem.order - 1] = item;
    }
  });

  Object.keys(rowGroups).forEach((rowKey) => {
    rowGroups[rowKey] = rowGroups[rowKey].filter(Boolean);
  });

  return rowGroups;
};

const calculateItemWidths = (
  itemCount: number,
  indicatorCount: number,
  containerWidth = 100 // percentage
): number[] => {
  // Available width for items (excluding indicators)
  const indicatorTotalWidth = (indicatorCount * INDICATOR_WIDTH_PX * 100) / window.innerWidth; // Convert to percentage
  const availableWidth = containerWidth - indicatorTotalWidth;
  
  // Equal distribution among items
  const itemWidth = availableWidth / itemCount;
  
  // Ensure minimum width
  const minWidth = Math.max(itemWidth, MIN_ITEM_WIDTH_PERCENTAGE);
  
  return new Array(itemCount).fill(minWidth);
};

export interface DnDV2Props<T> {
  items: DnDItem<T>[];
  layout: Record<string, DnDLayoutItemV2>;
  rowGap?: MantineNumberSize;
  columnGap?: MantineNumberSize;
  renderItem: (args: RenderItemArgs<T>) => React.ReactNode;
}

function DnDV2Component<T>({
  items,
  layout,
  rowGap = "md",
  columnGap = "md",
  renderItem,
}: DnDV2Props<T>) {
  const theme = useMantineTheme();

  // Memoize initial data
  const itemsById = useMemo(() => createItemsById(items), [items]);
  const initialRowIds = useMemo(() => createRowIds(layout), [layout]);
  const initialItemsByRowId = useMemo(
    () => createItemsByRowId(items, layout, initialRowIds),
    [items, layout, initialRowIds]
  );

  const [rowIds, setRowIds] = useState<string[]>(initialRowIds);
  const [itemsByRowId, setItemsByRowId] =
    useState<Record<string, DnDItem<T>[]>>(initialItemsByRowId);

  // State for drag operations
  const [dragState, setDragState] = useState<{
    activeID: string | null;
    activeIndex: number | null;
    activeRowID: string | null;
  }>({
    activeID: null,
    activeIndex: null,
    activeRowID: null,
  });

  // State for hover and resize operations
  const [indicatorHoverState, setIndicatorHoverState] = useState<IndicatorHoverState | null>(null);
  const [horizontalIndicatorState, setHorizontalIndicatorState] = useState<HorizontalIndicatorState>({
    visible: false,
    rowId: '',
    position: 'above',
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    rowId: '',
    indicatorId: '',
    startX: 0,
    initialWidths: {},
  });

  // Width state for items and indicators
  const [itemWidths, setItemWidths] = useState<Record<string, Record<string, number>>>({});
  const [indicatorWidths, setIndicatorWidths] = useState<Record<string, number>>({});

  const lastOverID = useRef<string | null>(null);
  const recentlyMovedToNewRow = useRef(false);

  const isActiveRow = dragState.activeID !== null ? rowIds.includes(dragState.activeID) : false;
  const sensors = useSensors(useSensor(PointerSensor));

  // Memoize gap values
  const rowGapValue = useMemo(
    () =>
      typeof rowGap === "number"
        ? `${rowGap}px`
        : theme.spacing[rowGap as keyof typeof theme.spacing],
    [rowGap, theme]
  );

  const columnGapValue = useMemo(
    () =>
      typeof columnGap === "number"
        ? `${columnGap}px`
        : theme.spacing[columnGap as keyof typeof theme.spacing],
    [columnGap, theme]
  );

  // Initialize item widths for each row
  const getItemWidthsForRow = useCallback((rowId: string): number[] => {
    const rowItems = itemsByRowId[rowId] || [];
    const itemCount = rowItems.length;
    const indicatorCount = itemCount + 1; // One more indicator than items
    
    if (itemWidths[rowId]) {
      return rowItems.map((item) => itemWidths[rowId][item.id] || MIN_ITEM_WIDTH_PERCENTAGE);
    }
    
    return calculateItemWidths(itemCount, indicatorCount);
  }, [itemsByRowId, itemWidths]);

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);

      let overID = getFirstCollision(intersections, "id");

      if (overID !== null) {
        // Handle indicator intersections
        if (isIndicator(overID as string)) {
          lastOverID.current = overID as string;
          return [{ id: overID }];
        }

        // Handle row container intersections
        if (overID in itemsByRowId) {
          const rowItemIDs = itemsByRowId[overID as string].map((item) => item.id);

          if (rowItemIDs.length > 0) {
            const availableContainers = args.droppableContainers.filter(
              (container) =>
                container.id !== overID &&
                rowItemIDs.includes(container.id as string)
            );

            if (availableContainers.length > 0) {
              const [closestItem] = closestCenter({
                ...args,
                droppableContainers: availableContainers,
              });

              if (closestItem?.id) {
                overID = closestItem.id;
              }
            }
          }
        }

        lastOverID.current = overID as string;
        return [{ id: overID }];
      }

      if (recentlyMovedToNewRow.current) {
        lastOverID.current = dragState.activeID;
      }

      return lastOverID.current ? [{ id: lastOverID.current }] : [];
    },
    [dragState.activeID, itemsByRowId]
  );

  const findRow = useCallback(
    (id: string) => {
      if (id in itemsByRowId) {
        return id;
      }

      return Object.keys(itemsByRowId).find((rowID) =>
        itemsByRowId[rowID].some((item) => item.id === id)
      );
    },
    [itemsByRowId]
  );

  // Resize handlers
  const handleIndicatorResizeStart = useCallback(
    (indicatorId: string, startX: number) => {
      const parsed = parseIndicatorId(indicatorId);
      if (!parsed || parsed.type !== 'vertical') return;

      const rowItems = itemsByRowId[parsed.rowId] || [];
      const initialWidths: Record<string, number> = {};
      
      rowItems.forEach((item) => {
        initialWidths[item.id] = itemWidths[parsed.rowId]?.[item.id] || MIN_ITEM_WIDTH_PERCENTAGE;
      });

      setResizeState({
        isResizing: true,
        rowId: parsed.rowId,
        indicatorId,
        startX,
        initialWidths,
      });
    },
    [itemsByRowId, itemWidths]
  );

  const handleIndicatorResize = useCallback(
    (deltaX: number) => {
      if (!resizeState.isResizing) return;

      const parsed = parseIndicatorId(resizeState.indicatorId);
      if (!parsed || parsed.type !== 'vertical') return;

      const rowItems = itemsByRowId[resizeState.rowId] || [];
      const deltaPercentage = (deltaX / window.innerWidth) * 100;

      // Calculate new widths based on which indicator is being dragged
      const newWidths = { ...resizeState.initialWidths };
      
      if (parsed.position === 'left') {
        // Dragging left indicator affects the item to the right
        const targetItem = rowItems[parsed.itemIndex];
        if (targetItem) {
          const newWidth = Math.max(
            resizeState.initialWidths[targetItem.id] - deltaPercentage,
            MIN_ITEM_WIDTH_PERCENTAGE
          );
          newWidths[targetItem.id] = newWidth;
        }
      } else {
        // Dragging right indicator affects the item to the left
        const targetItem = rowItems[parsed.itemIndex];
        if (targetItem) {
          const newWidth = Math.max(
            resizeState.initialWidths[targetItem.id] + deltaPercentage,
            MIN_ITEM_WIDTH_PERCENTAGE
          );
          newWidths[targetItem.id] = newWidth;
        }
      }

      setItemWidths(prev => ({
        ...prev,
        [resizeState.rowId]: newWidths,
      }));
    },
    [resizeState, itemsByRowId]
  );

  const handleIndicatorResizeEnd = useCallback(() => {
    setResizeState(prev => ({ ...prev, isResizing: false }));
  }, []);

  // Hover handlers for indicating potential drop positions
  const handleItemHoverLeft = useCallback(
    (itemId: string, rowId: string, index: number) => {
      const leftIndicatorId = createLeftIndicatorId(rowId, index);
      setIndicatorHoverState({
        rowId,
        indicatorId: leftIndicatorId,
        position: 'left',
        insertionIndex: index,
      });
    },
    []
  );

  const handleItemHoverRight = useCallback(
    (itemId: string, rowId: string, index: number) => {
      const rightIndicatorId = createRightIndicatorId(rowId, index);
      setIndicatorHoverState({
        rowId,
        indicatorId: rightIndicatorId,
        position: 'right',
        insertionIndex: index + 1,
      });
    },
    []
  );

  const handleItemHoverLeave = useCallback(() => {
    setIndicatorHoverState(null);
  }, []);

  // Drag handlers
  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const activeID = String(active.id);
      const foundActiveRowID = findRow(activeID);

      if (foundActiveRowID) {
        const foundActiveIndex = itemsByRowId[foundActiveRowID].findIndex(
          (item) => item.id === activeID
        );

        setDragState({
          activeID,
          activeIndex: foundActiveIndex,
          activeRowID: foundActiveRowID,
        });
      }
    },
    [itemsByRowId, findRow]
  );

  const handleDragOver = useCallback(
    ({ over }: { over: { id: string | number } | null }) => {
      const overID = over?.id;

      if (overID && typeof overID === "string") {
        if (isHorizontalIndicator(overID)) {
          const parsed = parseIndicatorId(overID);
          if (parsed && parsed.type === 'horizontal') {
            setHorizontalIndicatorState({
              visible: true,
              rowId: parsed.rowId,
              position: parsed.position,
            });
          }
        } else {
          setHorizontalIndicatorState(prev => ({ ...prev, visible: false }));
        }
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const activeID = String(active.id);
      const currentActiveRowID = findRow(activeID);

      if (!currentActiveRowID || !over) {
        setDragState({ activeID: null, activeIndex: null, activeRowID: null });
        setIndicatorHoverState(null);
        setHorizontalIndicatorState(prev => ({ ...prev, visible: false }));
        return;
      }

      const overID = String(over.id);

      // Handle vertical indicator drops
      if (isVerticalIndicator(overID)) {
        const parsed = parseIndicatorId(overID);
        if (parsed && parsed.type === 'vertical') {
          const targetRowItems = itemsByRowId[parsed.rowId] || [];
          
          if (targetRowItems.length >= MAX_ITEMS_PER_ROW) {
            // Can't add to full row
            setDragState({ activeID: null, activeIndex: null, activeRowID: null });
            setIndicatorHoverState(null);
            return;
          }

          const activeItem = itemsById[activeID];
          const insertIndex = parsed.position === 'left' ? parsed.itemIndex : parsed.itemIndex + 1;

          if (currentActiveRowID === parsed.rowId) {
            // Same row reordering
            const currentIndex = targetRowItems.findIndex(item => item.id === activeID);
            const adjustedInsertIndex = insertIndex > currentIndex ? insertIndex - 1 : insertIndex;
            
            setItemsByRowId(prev => ({
              ...prev,
              [parsed.rowId]: arrayMove(prev[parsed.rowId], currentIndex, adjustedInsertIndex),
            }));
          } else {
            // Cross-row movement
            setItemsByRowId(prev => {
              const newItems = { ...prev };
              
              // Remove from current row
              newItems[currentActiveRowID] = newItems[currentActiveRowID].filter(
                item => item.id !== activeID
              );
              
              // Add to target row
              const targetItems = [...newItems[parsed.rowId]];
              targetItems.splice(insertIndex, 0, activeItem);
              newItems[parsed.rowId] = targetItems;
              
              return newItems;
            });
          }
        }
      }

      // Handle horizontal indicator drops (create new row)
      if (isHorizontalIndicator(overID)) {
        const parsed = parseIndicatorId(overID);
        if (parsed && parsed.type === 'horizontal') {
          const activeItem = itemsById[activeID];
          const newRowID = `Row${Date.now()}`;
          const targetRowIndex = rowIds.indexOf(parsed.rowId);
          const insertIndex = parsed.position === 'above' ? targetRowIndex : targetRowIndex + 1;

          unstable_batchedUpdates(() => {
            setItemsByRowId(prev => {
              const newItems = { ...prev };
              
              // Remove from current row
              newItems[currentActiveRowID] = newItems[currentActiveRowID].filter(
                item => item.id !== activeID
              );
              
              // Create new row
              newItems[newRowID] = [activeItem];
              
              return newItems;
            });

            setRowIds(prev => {
              const newRowIds = [...prev];
              newRowIds.splice(insertIndex, 0, newRowID);
              return newRowIds;
            });
          });
        }
      }

      // Clean up state
      setDragState({ activeID: null, activeIndex: null, activeRowID: null });
      setIndicatorHoverState(null);
      setHorizontalIndicatorState(prev => ({ ...prev, visible: false }));
    },
    [findRow, itemsByRowId, itemsById, rowIds]
  );

  const handleDragCancel = useCallback(() => {
    setDragState({ activeID: null, activeIndex: null, activeRowID: null });
    setIndicatorHoverState(null);
    setHorizontalIndicatorState(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Stack spacing={rowGapValue}>
        <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
          {rowIds.map((rowID) => {
            const rowItems = itemsByRowId[rowID];
            if (!rowItems) return null;

            const rowItemIDs = rowItems.map((item) => item.id);
            const itemWidthsForRow = getItemWidthsForRow(rowID);

            return (
              <DnDSortableRowV2
                key={rowID}
                id={rowID}
                items={rowItemIDs}
                gapValue={columnGapValue}
                isLastRow={rowID === rowIds[rowIds.length - 1]}
                overDropZone={horizontalIndicatorState.visible ? `h-indicator-${horizontalIndicatorState.position}-${horizontalIndicatorState.rowId}` : null}
                horizontalIndicatorState={horizontalIndicatorState.visible && horizontalIndicatorState.rowId === rowID ? horizontalIndicatorState : undefined}
                highlightedIndicator={indicatorHoverState?.indicatorId || null}
                onIndicatorResizeStart={handleIndicatorResizeStart}
                onIndicatorResize={handleIndicatorResize}
                onIndicatorResizeEnd={handleIndicatorResizeEnd}
                indicatorWidths={indicatorWidths}
              >
                <SortableContext
                  items={rowItemIDs}
                  strategy={horizontalListSortingStrategy}
                >
                  {rowItemIDs.map((itemID, index) => {
                    const item = rowItems[index];
                    if (!item) return null;

                    const widthPercentage = itemWidthsForRow[index] || MIN_ITEM_WIDTH_PERCENTAGE;

                    return (
                      <DnDSortableItemV2
                        key={itemID}
                        item={item}
                        index={index}
                        rowID={rowID}
                        gapValue={columnGapValue}
                        renderItem={renderItem}
                        activeIndex={dragState.activeIndex}
                        disabled={isActiveRow}
                        isRowFull={rowItems.length >= MAX_ITEMS_PER_ROW}
                        numberOfItems={rowItems.length}
                        activeRowID={dragState.activeRowID}
                        widthPercentage={widthPercentage}
                        onHoverLeft={handleItemHoverLeft}
                        onHoverRight={handleItemHoverRight}
                        onHoverLeave={handleItemHoverLeave}
                      />
                    );
                  })}
                </SortableContext>
              </DnDSortableRowV2>
            );
          })}
        </SortableContext>
        
        {dragState.activeID && (
          <DragOverlay>
            <DnDItemV2
              item={itemsById[dragState.activeID]}
              index={0}
              rowID={dragState.activeID}
              dragging={true}
              clone={true}
              gapValue={columnGapValue}
              renderItem={renderItem}
              numberOfItems={
                dragState.activeRowID
                  ? itemsByRowId[dragState.activeRowID]?.length || 1
                  : 1
              }
              widthPercentage={MIN_ITEM_WIDTH_PERCENTAGE}
            />
          </DragOverlay>
        )}
      </Stack>
    </DndContext>
  );
}

export const DnDV2 = memo(DnDV2Component) as <T>(
  props: DnDV2Props<T>
) => React.ReactElement;