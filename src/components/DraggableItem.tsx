import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Text } from '@mantine/core';
import type { GridItem } from '../types/grid';

interface DraggableItemProps {
  item: GridItem;
  isDragging?: boolean;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCurrentlyDragging,
  } = useDraggable({
    id: item.id,
    data: {
      current: {
        item,
      },
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: `${(item.width / 12) * 100}%`,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      p="sm"
      radius="md"
      shadow="sm"
      bg={item.color || 'blue.1'}
      sx={{
        cursor: 'grab',
        border: isCurrentlyDragging ? '2px dashed #228be6' : '1px solid #e9ecef',
        transition: 'all 0.2s ease',
        '&:hover': {
          shadow: 'md',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <Text size="sm" fw={500}>
        {item.content}
      </Text>
      <Text size="xs" c="dimmed">
        {item.width}/12 cols
      </Text>
    </Paper>
  );
};