import React, { useState, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Group, Text, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface DashboardItem {
  id: string;
  content: React.ReactNode;
  span: number; // Number of columns this item spans (1-12)
  rowId: string;
  position: number; // Position within the row (0-11)
}

interface DashboardRow {
  id: string;
  items: DashboardItem[];
}

interface DashboardGridProps {
  children?: React.ReactNode;
  initialRows?: DashboardRow[];
  onLayoutChange?: (rows: DashboardRow[]) => void;
  className?: string;
}

interface GridSlotProps {
  rowId: string;
  position: number;
  isHighlighted?: boolean;
  children?: React.ReactNode;
}

const GridSlot: React.FC<GridSlotProps> = ({ 
  rowId, 
  position, 
  isHighlighted = false, 
  children 
}) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${rowId}-${position}`,
    data: {
      type: 'slot',
      rowId,
      position,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={(theme) => ({
        flex: '0 0 calc(8.333% - 8px)', // 12-column grid: 100% / 12 - gap
        minHeight: '80px',
        border: isHighlighted 
          ? `2px dashed ${theme.colors.blue[4]}` 
          : `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.sm,
        backgroundColor: isHighlighted 
          ? theme.colors.blue[0] 
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        position: 'relative',
        '&:hover': {
          backgroundColor: isHighlighted ? theme.colors.blue[1] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </Box>
  );
};

interface DraggableItemProps {
  item: DashboardItem;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isDragging ? 1000 : 1,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <Paper
        sx={(theme) => ({
          height: '100%',
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.white,
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: theme.radius.sm,
          boxShadow: isDragging ? theme.shadows.md : theme.shadows.xs,
          transition: 'box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: theme.shadows.sm,
          },
        })}
      >
        {item.content}
      </Paper>
    </Box>
  );
};

const DashboardGrid: React.FC<DashboardGridProps> = ({
  initialRows = [],
  onLayoutChange,
  className,
}) => {
  const [rows, setRows] = useState<DashboardRow[]>(initialRows);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightedSlots, setHighlightedSlots] = useState<Set<string>>(new Set());
  const [, { open, close }] = useDisclosure(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    open();
    
    // Highlight available slots
    const newHighlightedSlots = new Set<string>();
    rows.forEach(row => {
      for (let i = 0; i < 12; i++) {
        newHighlightedSlots.add(`${row.id}-${i}`);
      }
    });
    setHighlightedSlots(newHighlightedSlots);
  }, [rows, open]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'item' && overData?.type === 'slot') {
      // Update highlighted slots based on hover position
      const newHighlightedSlots = new Set<string>();
      if (overData.rowId) {
        for (let i = 0; i < 12; i++) {
          newHighlightedSlots.add(`${overData.rowId}-${i}`);
        }
      }
      setHighlightedSlots(newHighlightedSlots);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setHighlightedSlots(new Set());
    close();

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'item' && overData?.type === 'slot') {
      const item = activeData.item as DashboardItem;
      const targetRowId = overData.rowId as string;
      const targetPosition = overData.position as number;

      setRows(prevRows => {
        const newRows = [...prevRows];
        
        // Remove item from current position
        const sourceRowIndex = newRows.findIndex(row => row.id === item.rowId);
        if (sourceRowIndex !== -1) {
          newRows[sourceRowIndex] = {
            ...newRows[sourceRowIndex],
            items: newRows[sourceRowIndex].items.filter(i => i.id !== item.id)
          };
        }

        // Add item to new position
        const targetRowIndex = newRows.findIndex(row => row.id === targetRowId);
        if (targetRowIndex !== -1) {
          const updatedItem = {
            ...item,
            rowId: targetRowId,
            position: targetPosition,
          };
          
          newRows[targetRowIndex] = {
            ...newRows[targetRowIndex],
            items: [...newRows[targetRowIndex].items, updatedItem]
          };
        }

        onLayoutChange?.(newRows);
        return newRows;
      });
    }
  }, [onLayoutChange, close]);

  const getItemAtPosition = (rowId: string, position: number): DashboardItem | undefined => {
    const row = rows.find(r => r.id === rowId);
    return row?.items.find(item => item.position === position);
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box className={className}>
        <Stack spacing="md">
          {rows.map((row) => (
            <Box key={row.id}>
              <Text size="sm" weight={500} mb="xs">
                Row {row.id}
              </Text>
              <SortableContext
                items={[
                  ...row.items.map(item => item.id),
                  ...Array.from({ length: 12 }, (_, i) => `${row.id}-${i}`)
                ]}
                strategy={verticalListSortingStrategy}
              >
                <Group spacing="xs" sx={{ position: 'relative', minHeight: '100px' }}>
                  {Array.from({ length: 12 }, (_, position) => {
                    const item = getItemAtPosition(row.id, position);
                    const isHighlighted = highlightedSlots.has(`${row.id}-${position}`);
                    
                    return (
                      <GridSlot
                        key={`${row.id}-${position}`}
                        rowId={row.id}
                        position={position}
                        isHighlighted={isHighlighted}
                      >
                        {item && (
                          <DraggableItem
                            item={item}
                            key={item.id}
                          />
                        )}
                      </GridSlot>
                    );
                  })}
                </Group>
              </SortableContext>
            </Box>
          ))}
        </Stack>
      </Box>

      <DragOverlay>
        {activeId ? (
          <Box sx={{ width: '200px' }}>
            <Paper
              sx={(theme) => ({
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.gray[3]}`,
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.lg,
              })}
            >
              <Text size="sm">Dragging item...</Text>
            </Paper>
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardGrid;
export type { DashboardItem, DashboardRow, DashboardGridProps };