import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mantine/core";
import { useCallback, useState } from "react";
import { INDICATOR_WIDTH_PX } from "./constants";

interface VerticalIndicatorProps {
  id: string;
  position: 'left' | 'right';
  rowId: string;
  itemIndex: number;
  isHighlighted: boolean;
  onResizeStart: (indicatorId: string, startX: number) => void;
  onResize: (deltaX: number) => void;
  onResizeEnd: () => void;
  width?: number; // Width in pixels, defaults to INDICATOR_WIDTH_PX
}

export function VerticalIndicator({
  id,
  position,
  rowId,
  itemIndex,
  isHighlighted,
  onResizeStart,
  onResize,
  onResizeEnd,
  width = INDICATOR_WIDTH_PX,
}: VerticalIndicatorProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return; // Only handle left mouse button
      
      event.preventDefault();
      event.stopPropagation();
      
      setIsResizing(true);
      setIsDragging(true);
      onResizeStart(id, event.clientX);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - event.clientX;
        onResize(deltaX);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setIsDragging(false);
        onResizeEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, onResizeStart, onResize, onResizeEnd]
  );

  return (
    <Box
      ref={setNodeRef}
      onMouseDown={handleMouseDown}
      sx={(theme) => ({
        width: `${width}px`,
        height: '100%',
        backgroundColor: isHighlighted || isOver 
          ? theme.colors.blue[4] 
          : isDragging 
          ? theme.colors.blue[3]
          : 'transparent',
        border: isHighlighted || isOver || isDragging
          ? `2px solid ${theme.colors.blue[6]}`
          : `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.sm,
        cursor: 'ew-resize',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minWidth: `${width}px`,
        maxWidth: `${width * 2}px`,
        
        '&:hover': {
          backgroundColor: theme.colors.blue[2],
          border: `2px solid ${theme.colors.blue[5]}`,
        },

        // Visual grip lines
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '20px',
          backgroundColor: isHighlighted || isOver || isDragging
            ? theme.colors.blue[7]
            : theme.colors.gray[5],
          borderRadius: '1px',
          boxShadow: `2px 0 0 ${isHighlighted || isOver || isDragging
            ? theme.colors.blue[7]
            : theme.colors.gray[5]}`,
        },
      })}
      data-indicator-id={id}
      data-indicator-position={position}
      data-row-id={rowId}
      data-item-index={itemIndex}
    />
  );
}