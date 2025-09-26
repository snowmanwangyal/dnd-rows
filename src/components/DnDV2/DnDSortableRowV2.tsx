import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mantine/core";
import { memo } from "react";
import { 
  createLeftIndicatorId, 
  createRightIndicatorId, 
  INDICATOR_WIDTH_PX 
} from "./constants";
import { HorizontalIndicator } from "./HorizontalIndicator";
import { VerticalIndicator } from "./VerticalIndicator";

interface DnDSortableRowV2Props {
  id: string;
  items: string[];
  children: React.ReactNode;
  gapValue?: string;
  isLastRow?: boolean;
  overDropZone?: string | null;
  horizontalIndicatorState?: {
    visible: boolean;
    position: 'above' | 'below';
  };
  highlightedIndicator?: string | null;
  onIndicatorResizeStart: (indicatorId: string, startX: number) => void;
  onIndicatorResize: (deltaX: number) => void;
  onIndicatorResizeEnd: () => void;
  indicatorWidths?: Record<string, number>; // indicatorId -> width in pixels
}

function DnDSortableRowV2Component({
  id,
  items,
  children,
  gapValue = "0px",
  isLastRow = false,
  overDropZone,
  horizontalIndicatorState,
  highlightedIndicator,
  onIndicatorResizeStart,
  onIndicatorResize,
  onIndicatorResizeEnd,
  indicatorWidths = {},
}: DnDSortableRowV2Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Generate indicators for each item position
  const renderIndicatorsAndItems = () => {
    const elements: React.ReactNode[] = [];
    const childrenArray = Array.isArray(children) ? children : [children];

    // Add initial left indicator for first item
    if (items.length > 0) {
      const leftIndicatorId = createLeftIndicatorId(id, 0);
      elements.push(
        <VerticalIndicator
          key={leftIndicatorId}
          id={leftIndicatorId}
          position="left"
          rowId={id}
          itemIndex={0}
          isHighlighted={highlightedIndicator === leftIndicatorId}
          onResizeStart={onIndicatorResizeStart}
          onResize={onIndicatorResize}
          onResizeEnd={onIndicatorResizeEnd}
          width={indicatorWidths[leftIndicatorId] || INDICATOR_WIDTH_PX}
        />
      );
    }

    // Add items with right indicators
    childrenArray.forEach((child, index) => {
      if (index < items.length) {
        // Add the item
        elements.push(child);

        // Add right indicator
        const rightIndicatorId = createRightIndicatorId(id, index);
        elements.push(
          <VerticalIndicator
            key={rightIndicatorId}
            id={rightIndicatorId}
            position="right"
            rowId={id}
            itemIndex={index}
            isHighlighted={highlightedIndicator === rightIndicatorId}
            onResizeStart={onIndicatorResizeStart}
            onResize={onIndicatorResize}
            onResizeEnd={onIndicatorResizeEnd}
            width={indicatorWidths[rightIndicatorId] || INDICATOR_WIDTH_PX}
          />
        );
      }
    });

    return elements;
  };

  return (
    <>
      {/* Above horizontal indicator */}
      {horizontalIndicatorState?.visible && horizontalIndicatorState.position === 'above' && (
        <HorizontalIndicator
          id={`h-indicator-above-${id}`}
          position="above"
          rowId={id}
          isVisible={true}
          isHighlighted={overDropZone === `h-indicator-above-${id}`}
        />
      )}

      {/* Row container */}
      <Box
        ref={setNodeRef}
        style={style}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'stretch',
          width: '100%',
          minHeight: '60px',
          gap: gapValue,
          border: isDragging ? `2px dashed ${theme.colors.blue[5]}` : 'none',
          borderRadius: theme.radius.sm,
          backgroundColor: isDragging ? theme.colors.blue[0] : 'transparent',
          transition: 'all 0.2s ease',
          
          // Ensure proper alignment and spacing
          '& > *': {
            display: 'flex',
            alignItems: 'stretch',
          },
        })}
        {...attributes}
        {...listeners}
      >
        {renderIndicatorsAndItems()}
      </Box>

      {/* Below horizontal indicator */}
      {horizontalIndicatorState?.visible && horizontalIndicatorState.position === 'below' && (
        <HorizontalIndicator
          id={`h-indicator-below-${id}`}
          position="below"
          rowId={id}
          isVisible={true}
          isHighlighted={overDropZone === `h-indicator-below-${id}`}
        />
      )}

      {/* Below horizontal indicator for last row */}
      {isLastRow && (
        <HorizontalIndicator
          id={`h-indicator-below-${id}`}
          position="below"
          rowId={id}
          isVisible={overDropZone === `h-indicator-below-${id}`}
          isHighlighted={overDropZone === `h-indicator-below-${id}`}
        />
      )}
    </>
  );
}

export const DnDSortableRowV2 = memo(DnDSortableRowV2Component);