export interface LayoutItem {
  id: string;
  row: number;
  order: number;
  width: number; // fraction or percentage (0-1 for fraction, 0-100 for percentage)
}

export interface CustomDnDProps<T> {
  items: T[];
  renderItem: (item: T, isDragging?: boolean) => React.ReactNode;
  layout: LayoutItem[];
  onLayoutChange: (newLayout: LayoutItem[]) => void;
  onItemsChange: (newItems: T[]) => void;
  getItemId: (item: T) => string;
  rowHeight?: number;
  gap?: number;
}

export interface DropIndicatorProps {
  isVisible: boolean;
  position: 'before' | 'after';
  row: number;
  order: number;
  style?: React.CSSProperties;
}