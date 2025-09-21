import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { DraggableItem } from './DraggableItem';
import { DropZone } from './DropZone';
import type { GridRow as GridRowType, GridItem } from '../types/grid';

interface GridRowProps {
  row: GridRowType;
  onItemMove: (itemId: string, fromRowId: string, toRowId: string, toPosition: number) => void;
  onItemResize: (itemId: string, newWidth: number) => void;
  onItemDelete: (itemId: string) => void;
  isOver?: boolean;
  canDrop?: boolean;
}

export const GridRow: React.FC<GridRowProps> = ({
  row,
  onItemMove: _onItemMove,
  onItemResize: _onItemResize,
  onItemDelete: _onItemDelete,
  isOver = false,
  canDrop = false,
}) => {
  const calculateItemPositions = (items: GridItem[]) => {
    const positions: Array<{ item: GridItem; start: number; end: number }> = [];
    let currentPosition = 0;

    items.forEach((item) => {
      positions.push({
        item,
        start: currentPosition,
        end: currentPosition + item.width - 1,
      });
      currentPosition += item.width;
    });

    return positions;
  };

  const itemPositions = calculateItemPositions(row.items);
  const usedColumns = itemPositions.reduce((max, pos) => Math.max(max, pos.end + 1), 0);

  return (
    <Paper
      p="md"
      radius="md"
      shadow="sm"
      sx={{
        border: isOver && canDrop ? '2px solid #228be6' : '1px solid #e9ecef',
        backgroundColor: isOver && canDrop ? '#f8f9fa' : 'white',
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'sm', mb: 'sm' }}>
        <Text size="sm" fw={500} c="dimmed">
          Row {row.id}
        </Text>
        <Text size="xs" c="dimmed">
          {usedColumns}/12 columns used
        </Text>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '4px',
          minHeight: '80px',
          alignItems: 'center',
        }}
      >
        {/* Create drop zones for each column position */}
        {Array.from({ length: 13 }, (_, index) => (
          <DropZone
            key={`drop-${row.id}-${index}`}
            dropZone={{
              rowId: row.id,
              position: index,
            }}
            isOver={isOver}
            canDrop={canDrop}
          />
        ))}

        {/* Render items at their calculated positions */}
        {itemPositions.map((itemPos) => (
          <Box
            key={itemPos.item.id}
            sx={{
              gridColumn: `span ${itemPos.item.width}`,
              display: 'flex',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <DraggableItem item={itemPos.item} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};