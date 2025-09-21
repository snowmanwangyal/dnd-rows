export interface GridItem {
  id: string;
  content: string;
  width: number; // 1-12 columns
  color?: string;
}

export interface GridRow {
  id: string;
  items: GridItem[];
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        item: GridItem;
        rowId: string;
        position: number;
      };
    };
  };
  over: {
    id: string;
    data: {
      current: {
        rowId: string;
        position: number;
        isNewRow?: boolean;
      };
    };
  } | null;
}

export interface DropZone {
  rowId: string;
  position: number;
  isNewRow?: boolean;
}