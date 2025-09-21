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
        minWidth: '40px',
        border: isActive && canDrop 
          ? '2px dashed #228be6' 
          : '2px dashed transparent',
        borderRadius: '8px',
        backgroundColor: isActive && canDrop 
          ? '#e7f5ff' 
          : 'transparent',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flex: '0 0 auto',
        '&:hover': {
          borderColor: canDrop ? '#228be6' : 'transparent',
          backgroundColor: canDrop ? '#f8f9fa' : 'transparent',
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
            fontSize: '12px',
            color: '#228be6',
            fontWeight: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Drop here
        </Box>
      )}
    </Box>
  );
};