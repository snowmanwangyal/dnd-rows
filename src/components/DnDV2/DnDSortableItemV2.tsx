import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useCallback } from "react";
import { DnDItemV2 } from "./DnDItemV2";
import type { DnDItem, RenderItemArgs } from "./types";

interface DnDSortableItemV2Props<T> {
  item: DnDItem<T>;
  index: number;
  rowID: string;
  gapValue?: string;
  renderItem: (args: RenderItemArgs<T>) => React.ReactNode;
  activeIndex: number | null;
  disabled?: boolean;
  isRowFull?: boolean;
  numberOfItems?: number;
  activeRowID: string | null;
  widthPercentage: number;
  onHoverLeft?: (itemId: string, rowId: string, index: number) => void;
  onHoverRight?: (itemId: string, rowId: string, index: number) => void;
  onHoverLeave?: () => void;
}

function DnDSortableItemV2Component<T>({
  item,
  index,
  rowID,
  gapValue,
  renderItem,
  activeIndex,
  disabled = false,
  isRowFull = false,
  numberOfItems = 1,
  activeRowID,
  widthPercentage,
  onHoverLeft,
  onHoverRight,
  onHoverLeave,
}: DnDSortableItemV2Props<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!onHoverLeft || !onHoverRight) return;
      
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX;
      const centerX = rect.left + rect.width / 2;
      
      if (mouseX < centerX) {
        onHoverLeft(item.id, rowID, index);
      } else {
        onHoverRight(item.id, rowID, index);
      }
    },
    [item.id, rowID, index, onHoverLeft, onHoverRight]
  );

  const handleMouseLeave = useCallback(() => {
    if (onHoverLeave) {
      onHoverLeave();
    }
  }, [onHoverLeave]);

  return (
    <DnDItemV2
      ref={setNodeRef}
      item={item}
      index={index}
      rowID={rowID}
      dragging={isDragging}
      sorting={true}
      gapValue={gapValue}
      renderItem={renderItem}
      numberOfItems={numberOfItems}
      widthPercentage={widthPercentage}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...attributes}
      {...listeners}
    />
  );
}

export const DnDSortableItemV2 = memo(DnDSortableItemV2Component) as <T>(
  props: DnDSortableItemV2Props<T>
) => React.ReactElement;