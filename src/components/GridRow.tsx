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
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          minHeight: '80px',
          alignItems: 'center',
        }}
      >
        {/* Drop zone at the beginning */}
        <DropZone
          dropZone={{
            rowId: row.id,
            position: 0,
          }}
          isOver={isOver}
          canDrop={canDrop}
        />

        {/* Render items with drop zones between them */}
        {itemPositions.map((itemPos, index) => (
          <React.Fragment key={itemPos.item.id}>
            <Box
              sx={{
                width: `${(itemPos.item.width / 12) * 100}%`,
                minWidth: '60px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <DraggableItem item={itemPos.item} />
            </Box>
            
            {/* Drop zone after each item */}
            <DropZone
              dropZone={{
                rowId: row.id,
                position: index + 1,
              }}
              isOver={isOver}
              canDrop={canDrop}
            />
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};