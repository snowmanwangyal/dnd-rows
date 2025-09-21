import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { Box, Button, Group, Text } from '@mantine/core';
import { GridRow } from './GridRow';
import { DraggableItem } from './DraggableItem';
import type { GridRow as GridRowType, GridItem } from '../types/grid';
import { DropZone as DropZoneComponent } from './DropZone';

interface DragDropGridProps {
  initialRows?: GridRowType[];
  onRowsChange?: (rows: GridRowType[]) => void;
}

export const DragDropGrid: React.FC<DragDropGridProps> = ({
  initialRows = [],
  onRowsChange,
}) => {
  const [rows, setRows] = useState<GridRowType[]>(initialRows);
  const [activeItem, setActiveItem] = useState<GridItem | null>(null);
  const [draggedOverRow, setDraggedOverRow] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const item = findItemById(active.id as string);
    if (item) {
      setActiveItem(item);
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overId = over.id as string;
      if (overId.startsWith('drop-')) {
        const parts = overId.split('-');
        const rowId = parts[1];
        setDraggedOverRow(rowId);
      }
    } else {
      setDraggedOverRow(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveItem(null);
    setDraggedOverRow(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (overId.startsWith('drop-')) {
      const parts = overId.split('-');
      const rowId = parts[1];
      const position = parts[2];
      const targetPosition = parseInt(position, 10);
      
      // Check if this is a new row creation
      if (rowId === 'new-row') {
        createNewRowWithItem(activeId);
      } else {
        moveItemToPosition(activeId, rowId, targetPosition);
      }
    }
  }, []);

  const findItemById = (itemId: string): GridItem | null => {
    for (const row of rows) {
      const item = row.items.find(item => item.id === itemId);
      if (item) return item;
    }
    return null;
  };

  const findItemRow = (itemId: string): { row: GridRowType; index: number } | null => {
    for (let i = 0; i < rows.length; i++) {
      const itemIndex = rows[i].items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        return { row: rows[i], index: itemIndex };
      }
    }
    return null;
  };

  const moveItemToPosition = (itemId: string, targetRowId: string, targetPosition: number) => {
    const sourceItem = findItemRow(itemId);
    if (!sourceItem) return;

    const newRows = [...rows];
    const sourceRowIndex = rows.findIndex(row => row.id === sourceItem.row.id);
    const targetRowIndex = rows.findIndex(row => row.id === targetRowId);

    if (sourceRowIndex === -1 || targetRowIndex === -1) return;

    // Remove item from source row
    const [movedItem] = newRows[sourceRowIndex].items.splice(sourceItem.index, 1);

    // If target row is the same as source row, adjust position
    if (sourceRowIndex === targetRowIndex && sourceItem.index < targetPosition) {
      targetPosition--;
    }

    // Add item to target row at new position
    newRows[targetRowIndex].items.splice(targetPosition, 0, movedItem);

    setRows(newRows);
    onRowsChange?.(newRows);
  };

  const createNewRowWithItem = (itemId: string) => {
    const sourceItem = findItemRow(itemId);
    if (!sourceItem) return;

    const newRowId = `row-${Date.now()}`;
    const newRow: GridRowType = {
      id: newRowId,
      items: [],
    };

    const newRows = [...rows];
    const sourceRowIndex = rows.findIndex(row => row.id === sourceItem.row.id);

    // Remove item from source row
    const [movedItem] = newRows[sourceRowIndex].items.splice(sourceItem.index, 1);

    // Add new row with the moved item
    newRows.push({ ...newRow, items: [movedItem] });

    setRows(newRows);
    onRowsChange?.(newRows);
  };

  const addNewRow = () => {
    const newRowId = `row-${Date.now()}`;
    const newRow: GridRowType = {
      id: newRowId,
      items: [],
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    onRowsChange?.(newRows);
  };

  const addNewItem = (rowId: string, position: 'start' | 'end' = 'end') => {
    const newItemId = `item-${Date.now()}`;
    const newItem: GridItem = {
      id: newItemId,
      content: `Item ${rows.flatMap(r => r.items).length + 1}`,
      width: 3,
      color: `hsl(${Math.random() * 360}, 70%, 80%)`,
    };

    const newRows = rows.map(row => {
      if (row.id === rowId) {
        const items = position === 'start' 
          ? [newItem, ...row.items]
          : [...row.items, newItem];
        return { ...row, items };
      }
      return row;
    });

    setRows(newRows);
    onRowsChange?.(newRows);
  };

  // const deleteRow = (rowId: string) => {
  //   if (rows.length <= 1) return; // Keep at least one row
    
  //   const newRows = rows.filter(row => row.id !== rowId);
  //   setRows(newRows);
  //   onRowsChange?.(newRows);
  // };

  const deleteItem = (itemId: string) => {
    const newRows = rows.map(row => ({
      ...row,
      items: row.items.filter(item => item.id !== itemId),
    }));
    setRows(newRows);
    onRowsChange?.(newRows);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box>
        <Group mb="md">
          <Button onClick={addNewRow} size="sm">
            Add Row
          </Button>
          <Text size="sm" c="dimmed">
            {rows.length} row{rows.length !== 1 ? 's' : ''}
          </Text>
        </Group>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 40px' }}>
          {rows.map((row, index) => (
            <Box key={row.id} sx={{ position: 'relative' }}>
              <GridRow
                row={row}
                onItemMove={(itemId, _fromRowId, toRowId, toPosition) => moveItemToPosition(itemId, toRowId, toPosition)}
                onItemResize={() => {}} // TODO: Implement resizing
                onItemDelete={deleteItem}
                onAddItem={addNewItem}
                isOver={draggedOverRow === row.id}
                canDrop={!!activeItem}
                isLastRow={index === rows.length - 1}
                onAddNewRow={addNewRow}
              />

              {/* Drop zone below each row for creating new rows */}
              {index === rows.length - 1 && (
                <Box mt="16px" sx={{ position: 'relative' }}>
                  <DropZoneComponent
                    dropZone={{
                      rowId: 'new-row',
                      position: 0,
                      isNewRow: true,
                    }}
                    isOver={draggedOverRow === 'new-row'}
                    canDrop={!!activeItem}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <DragOverlay>
        {activeItem ? <DraggableItem item={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};