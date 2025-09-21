# Drag & Drop Grid Component POC

A flexible drag and drop grid system built with React, TypeScript, Mantine V6, and dnd-kit. This component allows you to create a 12-column grid layout where items can be dragged between rows and positions, with the ability to create new rows dynamically.

## Features

- ✅ **12-column grid system** with flexible item widths (1-12 columns)
- ✅ **Drag and drop** items between rows and positions
- ✅ **Create new rows** by dropping items below the last row
- ✅ **Visual feedback** during drag operations
- ✅ **Add/remove rows and items** dynamically
- ✅ **Responsive design** with Mantine V6 components
- ✅ **TypeScript support** with full type safety

## Installation

```bash
pnpm add @mantine/core@6 @mantine/hooks@6 @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Usage

```tsx
import { DragDropGrid } from './components/DragDropGrid';
import type { GridRow } from './types/grid';

const initialRows: GridRow[] = [
  {
    id: 'row-1',
    items: [
      {
        id: 'item-1',
        content: 'Header',
        width: 12,
        color: 'hsl(200, 70%, 80%)',
      },
    ],
  },
  {
    id: 'row-2',
    items: [
      {
        id: 'item-2',
        content: 'Sidebar',
        width: 3,
        color: 'hsl(120, 70%, 80%)',
      },
      {
        id: 'item-3',
        content: 'Main Content',
        width: 6,
        color: 'hsl(30, 70%, 80%)',
      },
      {
        id: 'item-4',
        content: 'Widget',
        width: 3,
        color: 'hsl(280, 70%, 80%)',
      },
    ],
  },
];

function App() {
  const [rows, setRows] = useState<GridRow[]>(initialRows);

  return (
    <DragDropGrid
      initialRows={rows}
      onRowsChange={setRows}
    />
  );
}
```

## Component Structure

### Core Components

- **`DragDropGrid`** - Main container component with drag and drop context
- **`GridRow`** - Individual row component with 12-column layout
- **`DraggableItem`** - Draggable item component with configurable width
- **`DropZone`** - Drop zone component for positioning items

### Types

```typescript
interface GridItem {
  id: string;
  content: string;
  width: number; // 1-12 columns
  color?: string;
}

interface GridRow {
  id: string;
  items: GridItem[];
}
```

## Key Features Explained

### 12-Column Grid System
Each row is divided into 12 columns, and items can occupy any number of columns (1-12). Items are positioned using flexbox with percentage-based widths.

### Drag and Drop
- Items can be dragged between any position within a row
- Items can be moved between different rows
- Visual feedback shows valid drop zones during drag operations

### Row Creation
- Drop items below the last row to create a new row
- New rows are automatically created with the dropped item

### Dynamic Management
- Add new items to any row using the "Add Item" button
- Add new empty rows using the "Add Row" button
- Delete rows (minimum of 1 row is maintained)

## Styling

The component uses Mantine V6's styling system with:
- Consistent spacing and typography
- Hover and active states for interactive elements
- Visual feedback during drag operations
- Responsive design principles

## Browser Support

- Modern browsers with ES6+ support
- React 18+
- TypeScript 4.5+

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Integration with Secoda

This component is designed to be easily integrated into your Secoda application. The drag and drop functionality allows users to:

1. **Organize data views** by dragging components between rows
2. **Create custom layouts** with flexible column arrangements
3. **Build responsive dashboards** that adapt to different screen sizes
4. **Manage complex UI layouts** with intuitive drag and drop interactions

The component provides a solid foundation for building more complex layout management features in your Secoda app.