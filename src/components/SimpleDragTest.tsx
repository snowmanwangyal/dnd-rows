import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { Box, Paper, Text } from '@mantine/core';

const SimpleDraggableItem = ({ id, content }: { id: string; content: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: {
      current: {
        item: { id, content },
      },
    },
  });

  return (
    <Paper
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
      p="md"
      radius="md"
      shadow="sm"
      bg="blue.1"
      sx={{ cursor: 'grab' }}
    >
      <Text>{content}</Text>
    </Paper>
  );
};

const SimpleDropZone = ({ id, label }: { id: string; label: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      current: {
        rowId: id,
        position: 0,
      },
    },
  });

  return (
    <Box
      ref={setNodeRef}
      p="md"
      radius="md"
      sx={{
        border: '2px dashed',
        borderColor: isOver ? '#228be6' : '#e9ecef',
        backgroundColor: isOver ? '#e7f5ff' : 'transparent',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>{label}</Text>
    </Box>
  );
};

export const SimpleDragTest = () => {
  const [items, setItems] = useState([
    { id: 'item-1', content: 'Item 1', rowId: 'row-1' },
    { id: 'item-2', content: 'Item 2', rowId: 'row-1' },
    { id: 'item-3', content: 'Item 3', rowId: 'row-2' },
  ]);
  const [activeItem, setActiveItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const item = items.find(item => item.id === active.id);
    if (item) {
      setActiveItem(item);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('Simple drag end:', { activeId: active.id, overId: over?.id, overData: over?.data.current });
    
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (overId.startsWith('drop-')) {
      const overData = over.data.current;
      if (overData) {
        const { rowId } = overData;
        
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === activeId 
              ? { ...item, rowId }
              : item
          )
        );
      }
    }
  };

  const rows = ['row-1', 'row-2', 'row-3'];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box>
        <Text size="lg" fw={500} mb="md">Simple Drag Test</Text>
        
        {rows.map(rowId => (
          <Box key={rowId} mb="md">
            <Text size="sm" mb="sm">Row {rowId}</Text>
            <SimpleDropZone id={`drop-${rowId}`} label={`Drop zone for ${rowId}`} />
            
            <Box mt="sm" sx={{ display: 'flex', gap: 'sm' }}>
              {items
                .filter(item => item.rowId === rowId)
                .map(item => (
                  <SimpleDraggableItem
                    key={item.id}
                    id={item.id}
                    content={item.content}
                  />
                ))}
            </Box>
          </Box>
        ))}
      </Box>

      <DragOverlay>
        {activeItem ? (
          <SimpleDraggableItem
            id={activeItem.id}
            content={activeItem.content}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};