import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDndContext,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import type { CustomDnDProps, LayoutItem, Position } from "../types/custom-dnd";
import styles from "./CustomDnD.module.css";

// Sortable Item Component with CSS-based indicators
function SortableItem<T>({
  item,
  renderItem,
  getItemId,
  layout,
  isGrid = false,
}: {
  item: T;
  renderItem: (item: T, isDragging?: boolean) => React.ReactNode;
  getItemId: (item: T) => string;
  layout: LayoutItem[];
  isGrid?: boolean;
}) {
  const { activatorEvent, over } = useDndContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: getItemId(item),
    animateLayoutChanges: () => true,
  });

  const activeIndex = layout.findIndex((l) => l.id === getItemId(item));
  const overIndex = over?.id ? layout.findIndex((l) => l.id === over?.id) : -1;
  
  const insertPosition = overIndex !== -1 && activeIndex !== overIndex
    ? activeIndex < overIndex ? Position.After : Position.Before
    : undefined;

  const itemStyle = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const wrapperClasses = classNames(styles.itemWrapper, {
    [styles.active]: isDragging,
    [styles.clone]: isDragging,
    [styles.grid]: isGrid,
    [styles.insertBefore]: insertPosition === Position.Before,
    [styles.insertAfter]: insertPosition === Position.After,
  });

  return (
    <div className={wrapperClasses}>
      <div
        ref={setNodeRef}
        className={styles.item}
        style={itemStyle}
        {...attributes}
        {...listeners}
      >
        {renderItem(item, isDragging)}
      </div>
    </div>
  );
}

// Droppable Row Component
function DroppableRow<T>({
  row,
  items,
  renderItem,
  getItemId,
  layout,
  rowHeight,
  gap,
  isGrid = false,
}: {
  row: number;
  items: T[];
  renderItem: (item: T, isDragging?: boolean) => React.ReactNode;
  getItemId: (item: T) => string;
  layout: LayoutItem[];
  rowHeight: number;
  gap: number;
  isGrid?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `row-${row}`,
  });

  const rowClasses = classNames(styles.row, {
    [styles.grid]: isGrid,
  });

  return (
    <div
      ref={setNodeRef}
      className={rowClasses}
      style={{
        gap: `${gap}px`,
        marginBottom: `${gap}px`,
        minHeight: `${rowHeight}px`,
      }}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={horizontalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem
            key={getItemId(item)}
            item={item}
            renderItem={renderItem}
            getItemId={getItemId}
            layout={layout}
            isGrid={isGrid}
          />
        ))}
      </SortableContext>
    </div>
  );
}

// Generic CustomDnD Component
export function CustomDnD<T>({
  items,
  renderItem,
  layout,
  onLayoutChange,
  onItemsChange: _onItemsChange,
  getItemId,
  rowHeight = 120,
  gap = 16,
}: CustomDnDProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group items by row
  const itemsByRow = useMemo(() => {
    const grouped: Record<number, T[]> = {};
    layout.forEach((layoutItem) => {
      const item = items.find((item) => getItemId(item) === layoutItem.id);
      if (item) {
        if (!grouped[layoutItem.row]) {
          grouped[layoutItem.row] = [];
        }
        grouped[layoutItem.row].push(item);
      }
    });

    // Sort items in each row by order
    Object.keys(grouped).forEach((rowKey) => {
      const row = parseInt(rowKey);
      grouped[row].sort((a, b) => {
        const aLayout = layout.find((l) => l.id === getItemId(a));
        const bLayout = layout.find((l) => l.id === getItemId(b));
        return (aLayout?.order || 0) - (bLayout?.order || 0);
      });
    });

    return grouped;
  }, [items, layout, getItemId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // The CSS-based indicators will handle the visual feedback
    // No need for complex JavaScript logic here
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Find layouts
    const activeLayout = layout.find((l) => l.id === activeId);
    if (!activeLayout) return;

    // Check if we're dropping on a row
    if (overId.startsWith("row-")) {
      const targetRow = parseInt(overId.replace("row-", ""));
      const newLayout = layout.map((item) => {
        if (item.id === activeId) {
          return { ...item, row: targetRow, order: 0 };
        }
        return item;
      });
      onLayoutChange(newLayout);
      return;
    }

    const overLayout = layout.find((l) => l.id === overId);
    if (!overLayout) return;

    const activeRow = activeLayout.row;
    const overRow = overLayout.row;
    const overOrder = overLayout.order;

    // Calculate new order
    const newOrder =
      activeRow === overRow && activeLayout.order < overOrder
        ? overOrder - 1
        : overOrder;

    // Update layout
    const newLayout = layout.map((item) => {
      if (item.id === activeId) {
        return { ...item, row: overRow, order: newOrder };
      }

      // Adjust order of other items in the target row
      if (item.row === overRow && item.id !== activeId) {
        if (activeRow === overRow) {
          // Moving within same row
          if (
            activeLayout.order < overOrder &&
            item.order > activeLayout.order &&
            item.order <= overOrder
          ) {
            return { ...item, order: item.order - 1 };
          } else if (
            activeLayout.order > overOrder &&
            item.order >= overOrder &&
            item.order < activeLayout.order
          ) {
            return { ...item, order: item.order + 1 };
          }
        } else {
          // Moving between rows
          if (item.order >= newOrder) {
            return { ...item, order: item.order + 1 };
          }
        }
      }

      return item;
    });

    onLayoutChange(newLayout);
  };

  const activeItem = activeId
    ? items.find((item) => getItemId(item) === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.customDnD}>
        {Object.entries(itemsByRow).map(([rowKey, rowItems]) => {
          const row = parseInt(rowKey);

          return (
            <DroppableRow
              key={row}
              row={row}
              items={rowItems as T[]}
              renderItem={renderItem}
              getItemId={getItemId}
              layout={layout}
              rowHeight={rowHeight}
              gap={gap}
              isGrid={false} // Set to true when using grid layout
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeItem ? renderItem(activeItem, true) : null}
      </DragOverlay>
    </DndContext>
  );
}