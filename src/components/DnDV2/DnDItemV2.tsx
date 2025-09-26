import { Box } from "@mantine/core";
import { forwardRef } from "react";
import type { DnDItem, RenderItemArgs } from "./types";

interface DnDItemV2Props<T> {
  item: DnDItem<T>;
  index: number;
  rowID: string;
  dragging?: boolean;
  sorting?: boolean;
  clone?: boolean;
  gapValue?: string;
  renderItem: (args: RenderItemArgs<T>) => React.ReactNode;
  numberOfItems?: number;
  widthPercentage: number; // Width as percentage of available space (excluding indicators)
  style?: React.CSSProperties;
}

export const DnDItemV2 = forwardRef<
  HTMLDivElement,
  DnDItemV2Props<any>
>(function DnDItemV2(
  {
    item,
    index,
    rowID,
    dragging = false,
    sorting = false,
    clone = false,
    gapValue = "0px",
    renderItem,
    numberOfItems = 1,
    widthPercentage,
    style,
    ...props
  },
  ref
) {
  return (
    <Box
      ref={ref}
      style={{
        ...style,
        width: `${widthPercentage}%`,
        minWidth: `${widthPercentage}%`,
        maxWidth: `${widthPercentage}%`,
        flexShrink: 0,
        flexGrow: 0,
      }}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'stretch',
        transition: dragging ? 'none' : 'width 0.2s ease',
        
        // Add visual feedback during dragging
        opacity: dragging ? 0.8 : 1,
        transform: dragging ? 'scale(1.02)' : 'scale(1)',
        
        // Ensure the item takes full height of the row
        '& > *': {
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
        },
      })}
      {...props}
    >
      {renderItem({
        item,
        index,
        rowID,
        dragging,
        sorting,
        clone,
        gapValue,
        numberOfItems,
        widthPercentage,
      })}
    </Box>
  );
});