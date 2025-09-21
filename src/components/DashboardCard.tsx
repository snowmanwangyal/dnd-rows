import React from 'react';
import { Paper, Text, Badge, Group, ActionIcon } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DashboardCard as DashboardCardType } from '../types/dashboard';

interface DashboardCardProps {
  card: DashboardCardType;
  isDragging?: boolean;
}

export function DashboardCardComponent({ card, isDragging = false }: DashboardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getCardColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: '#228be6',
      green: '#51cf66',
      orange: '#ff922b',
      purple: '#9775fa',
      cyan: '#22d3ee',
      pink: '#f783ac',
      gray: '#868e96',
    };
    return colors[color] || colors.gray;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chart': return '📊';
      case 'metric': return '📈';
      case 'table': return '📋';
      case 'list': return '📝';
      default: return '📄';
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={{
        ...style,
        width: '200px',
        minHeight: '120px',
        cursor: 'grab',
        border: isDragging ? '2px solid #228be6' : '1px solid #e9ecef',
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transform: isDragging ? 'rotate(5deg)' : style.transform,
      }}
      p="md"
      {...attributes}
      {...listeners}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm" truncate>
          {card.title}
        </Text>
        <Badge
          size="xs"
          color={card.color}
          variant="light"
        >
          {getTypeIcon(card.type)}
        </Badge>
      </Group>
      
      <Text size="sm" c="dimmed" style={{ minHeight: '40px' }}>
        {card.content}
      </Text>

      <Group justify="flex-end" mt="xs">
        <ActionIcon
          size="xs"
          variant="subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            // Handle edit action
          }}
        >
          ✏️
        </ActionIcon>
      </Group>
    </Paper>
  );
}