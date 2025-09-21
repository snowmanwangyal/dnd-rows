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
        minHeight: dropZone.isNewRow ? '40px' : '60px',
        minWidth: dropZone.isNewRow ? '100%' : '8px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Vertical highlight indicator for between items */}
      {isActive && canDrop && !dropZone.isNewRow && (
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '100%',
            backgroundColor: '#228be6',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(34, 139, 230, 0.5)',
            zIndex: 5,
          }}
        />
      )}

      {/* Horizontal highlight indicator for between rows */}
      {isActive && canDrop && dropZone.isNewRow && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            transform: 'translateY(-50%)',
            height: '4px',
            backgroundColor: '#228be6',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(34, 139, 230, 0.5)',
            zIndex: 5,
          }}
        />
      )}
      
      {/* Invisible drop area */}
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          minWidth: dropZone.isNewRow ? '100%' : '20px',
          zIndex: 1,
        }}
      />
    </Box>
  );
};