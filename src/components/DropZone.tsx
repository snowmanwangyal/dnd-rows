import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mantine/core';
import type { DropZone as DropZoneType } from '../types/grid';

interface DropZoneProps {
  dropZone: DropZoneType;
  isOver?: boolean;
  canDrop?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  dropZone, 
  isOver = false, 
  canDrop = false 
}) => {
  const { setNodeRef, isOver: isCurrentlyOver } = useDroppable({
    id: `drop-${dropZone.rowId}-${dropZone.position}`,
    data: {
      current: {
        rowId: dropZone.rowId,
        position: dropZone.position,
        isNewRow: dropZone.isNewRow,
      },
    },
  });

  const isActive = isCurrentlyOver || isOver;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: '60px',
        border: isActive && canDrop 
          ? '2px dashed #228be6' 
          : '1px dashed transparent',
        borderRadius: '4px',
        backgroundColor: isActive && canDrop 
          ? '#e7f5ff' 
          : isActive 
            ? '#f8f9fa'
            : 'transparent',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: canDrop ? 'pointer' : 'default',
        '&:hover': {
          borderColor: canDrop ? '#228be6' : '#dee2e6',
          backgroundColor: canDrop ? '#e7f5ff' : '#f8f9fa',
        },
      }}
    >
      {isActive && canDrop && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '10px',
            color: '#228be6',
            fontWeight: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          Drop
        </Box>
      )}
    </Box>
  );
};