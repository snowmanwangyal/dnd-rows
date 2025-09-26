export interface DnDItem<T = any> {
  id: string;
  data: T;
}

export interface DnDLayoutItemV2 {
  row: number;
  order: number;
  widthPercentage: number; // Width as percentage of available space (excluding indicators)
}

export interface RenderItemArgs<T> {
  item: DnDItem<T>;
  index: number;
  rowID: string;
  dragging?: boolean;
  sorting?: boolean;
  clone?: boolean;
  gapValue?: string;
  numberOfItems?: number;
  widthPercentage?: number;
}

export interface IndicatorHoverState {
  rowId: string;
  indicatorId: string;
  position: 'left' | 'right';
  insertionIndex: number;
}

export interface ResizeState {
  isResizing: boolean;
  rowId: string;
  indicatorId: string;
  startX: number;
  initialWidths: Record<string, number>; // itemId -> width percentage
}

export interface HorizontalIndicatorState {
  visible: boolean;
  rowId: string;
  position: 'above' | 'below';
}