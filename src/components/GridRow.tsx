import React, { useState } from 'react';
import { Box, Button } from '@mantine/core';
import { DraggableItem } from './DraggableItem';
import { DropZone } from './DropZone';
import type { GridRow as GridRowType, GridItem } from '../types/grid';

interface GridRowProps {
  row: GridRowType;
  onItemMove: (itemId: string, fromRowId: string, toRowId: string, toPosition: number) => void;
  onItemResize: (itemId: string, newWidth: number) => void;
  onItemDelete: (itemId: string) => void;
  onAddItem: (rowId: string, position: 'start' | 'end') => void;
  isOver?: boolean;
  canDrop?: boolean;
  isLastRow?: boolean;
  onAddNewRow?: () => void;
}

export const GridRow: React.FC<GridRowProps> = ({
  row,
  onItemMove: _onItemMove,
  onItemResize: _onItemResize,
  onItemDelete: _onItemDelete,
  onAddItem,
  isOver = false,
  canDrop = false,
  isLastRow = false,
  onAddNewRow,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minHeight: '60px',
        padding: '8px 0',
        '&:hover .add-button': {
          opacity: 1,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left add button */}
      <Button
        className="add-button"
        size="xs"
        variant="light"
        color="blue"
        sx={{
          position: 'absolute',
          left: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 10,
          height: '40px',
          minWidth: '32px',
          padding: '0 8px',
          fontSize: '10px',
          whiteSpace: 'nowrap',
        }}
        onClick={() => onAddItem(row.id, 'start')}
      >
        + Add
      </Button>

      {/* Right add button */}
      <Button
        className="add-button"
        size="xs"
        variant="light"
        color="blue"
        sx={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 10,
          height: '40px',
          minWidth: '32px',
          padding: '0 8px',
          fontSize: '10px',
          whiteSpace: 'nowrap',
        }}
        onClick={() => onAddItem(row.id, 'end')}
      >
        + Add
      </Button>

      {/* Bottom add button for last row */}
      {isLastRow && (
        <Button
          className="add-button"
          size="xs"
          variant="light"
          color="green"
          sx={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            zIndex: 10,
            height: '24px',
            minWidth: '80px',
            padding: '0 12px',
            fontSize: '10px',
            whiteSpace: 'nowrap',
          }}
          onClick={onAddNewRow}
        >
          + New Row
        </Button>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'center',
          width: '100%',
          minHeight: '60px',
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
    </Box>
  );
};