import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CustomDnDProps, DropIndicatorProps } from "../types/custom-dnd";

// Drop Indicator Component
const DropIndicator: React.FC<DropIndicatorProps> = ({
  isVisible,
  position: _position,
  row: _row,
  order: _order,
  style,
}) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        width: "4px",
        height: "100%",
        backgroundColor: "#228be6",
        borderRadius: "2px",
        zIndex: 1000,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

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
  const [dropIndicator, setDropIndicator] = useState<{
    isVisible: boolean;
    position: 'before' | 'after';
    row: number;
    order: number;
    style?: React.CSSProperties;
  }>({
    isVisible: false,
    position: 'after',
    row: 0,
    order: 0,
  });

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
    const { active, over } = event;
    if (!over) {
      setDropIndicator({ isVisible: false, position: 'after', row: 0, order: 0 });
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active item's layout
    const activeLayout = layout.find((l) => l.id === activeId);
    if (!activeLayout) return;

    // Find the over item's layout
    const overLayout = layout.find((l) => l.id === overId);
    if (!overLayout) return;

    // Calculate drop position
    const overRow = overLayout.row;
    const overOrder = overLayout.order;
    const activeRow = activeLayout.row;

    // Determine if we should show indicator before or after
    const shouldShowBefore = activeRow !== overRow || activeLayout.order < overOrder;

    // Calculate indicator position
    const rowItems = itemsByRow[overRow] || [];
    const overIndex = rowItems.findIndex((item) => getItemId(item) === overId);
    
    if (overIndex === -1) return;

    const indicatorStyle: React.CSSProperties = {
      top: `${overRow * (rowHeight + gap)}px`,
      left: shouldShowBefore 
        ? `${overIndex * (200 + gap) - 2}px` 
        : `${(overIndex + 1) * (200 + gap) - 2}px`,
      height: `${rowHeight}px`,
    };

    setDropIndicator({
      isVisible: true,
      position: shouldShowBefore ? 'before' : 'after',
      row: overRow,
      order: shouldShowBefore ? overOrder : overOrder + 1,
      style: indicatorStyle,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDropIndicator({ isVisible: false, position: 'after', row: 0, order: 0 });

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Find layouts
    const activeLayout = layout.find((l) => l.id === activeId);
    const overLayout = layout.find((l) => l.id === overId);
    
    if (!activeLayout || !overLayout) return;

    const activeRow = activeLayout.row;
    const overRow = overLayout.row;
    const overOrder = overLayout.order;

    // Calculate new order
    const newOrder = activeRow === overRow && activeLayout.order < overOrder 
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
          if (activeLayout.order < overOrder && item.order > activeLayout.order && item.order <= overOrder) {
            return { ...item, order: item.order - 1 };
          } else if (activeLayout.order > overOrder && item.order >= overOrder && item.order < activeLayout.order) {
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

  const activeItem = activeId ? items.find((item) => getItemId(item) === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ position: "relative" }}>
        {Object.entries(itemsByRow).map(([rowKey, rowItems]) => {
          const row = parseInt(rowKey);
          
          return (
            <div
              key={row}
              style={{
                display: "flex",
                gap: `${gap}px`,
                marginBottom: `${gap}px`,
                minHeight: `${rowHeight}px`,
                alignItems: "flex-start",
              }}
            >
              <SortableContext
                items={(rowItems as T[]).map(getItemId)}
                strategy={horizontalListSortingStrategy}
              >
                {(rowItems as T[]).map((item) => renderItem(item))}
              </SortableContext>
            </div>
          );
        })}

        <DropIndicator
          isVisible={dropIndicator.isVisible}
          position={dropIndicator.position}
          row={dropIndicator.row}
          order={dropIndicator.order}
          style={dropIndicator.style}
        />
      </div>

      <DragOverlay>
        {activeItem ? renderItem(activeItem, true) : null}
      </DragOverlay>
    </DndContext>
  );
}