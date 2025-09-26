import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mantine/core";

interface HorizontalIndicatorProps {
  id: string;
  position: 'above' | 'below';
  rowId: string;
  isVisible: boolean;
  isHighlighted?: boolean;
}

export function HorizontalIndicator({
  id,
  position,
  rowId,
  isVisible,
  isHighlighted = false,
}: HorizontalIndicatorProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  if (!isVisible) return null;

  return (
    <Box
      ref={setNodeRef}
      sx={(theme) => ({
        width: '100%',
        height: '8px',
        backgroundColor: isHighlighted || isOver 
          ? theme.colors.blue[4] 
          : 'transparent',
        border: isHighlighted || isOver
          ? `2px solid ${theme.colors.blue[6]}`
          : `1px dashed ${theme.colors.gray[4]}`,
        borderRadius: theme.radius.sm,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '4px 0',
        
        '&:hover': {
          backgroundColor: theme.colors.blue[2],
          border: `2px solid ${theme.colors.blue[5]}`,
        },

        // Visual indication of drop zone
        '&::before': {
          content: isHighlighted || isOver ? '"Drop here to create new row"' : '""',
          position: 'absolute',
          fontSize: '12px',
          color: theme.colors.blue[7],
          fontWeight: 500,
          backgroundColor: theme.colors.blue[0],
          padding: '2px 8px',
          borderRadius: theme.radius.sm,
          whiteSpace: 'nowrap',
          opacity: isHighlighted || isOver ? 1 : 0,
          transition: 'opacity 0.2s ease',
        },
      })}
      data-horizontal-indicator-id={id}
      data-horizontal-position={position}
      data-row-id={rowId}
    />
  );
}