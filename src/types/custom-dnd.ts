export interface LayoutItem {
  id: string;
  row: number;
  order: number;
}

export interface CustomDnDProps<T> {
  items: T[];
  renderItem: (item: T, isDragging?: boolean) => React.ReactNode;
  layout: LayoutItem[];
  onLayoutChange: (layout: LayoutItem[]) => void;
  onItemsChange?: (items: T[]) => void;
  getItemId: (item: T) => string;
  rowHeight?: number;
  gap?: number;
}

export interface DropIndicatorProps {
  isVisible: boolean;
  position: "before" | "after";
  row: number;
  order: number;
  style?: React.CSSProperties;
}

export enum Layout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Grid = 'grid',
}

export enum Position {
  Before = -1,
  After = 1,
}