# Drag-and-Drop Dashboard Component

A custom React component built with Mantine V6 and dnd-kit that provides a 12-column grid system with drag-and-drop functionality for dashboard layouts.

## Features

- **12-Column Grid System**: Each row contains 12 equal-width columns for precise item positioning
- **Vertical Drag-and-Drop**: Move items between different rows
- **Horizontal Positioning**: Position items at specific column positions within rows
- **Visual Feedback**: Highlighted drop zones show available positions during drag operations
- **Responsive Design**: Built with Mantine components for consistent styling
- **TypeScript Support**: Fully typed for better development experience

## Installation

```bash
pnpm install
```

## Dependencies

- React 19.1.1
- Mantine V6 (@mantine/core, @mantine/hooks, @mantine/notifications)
- dnd-kit (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities)
- Vite (build tool)

## Usage

```tsx
import DashboardGrid, { type DashboardItem, type DashboardRow } from './components/DashboardGrid';

const initialRows: DashboardRow[] = [
  {
    id: 'row-1',
    items: [
      {
        id: 'item-1',
        content: <div>Your content here</div>,
        span: 4, // Spans 4 columns
        rowId: 'row-1',
        position: 0, // Starts at column 0
      },
    ],
  },
];

function MyDashboard() {
  const handleLayoutChange = (newRows: DashboardRow[]) => {
    console.log('Layout changed:', newRows);
  };

  return (
    <DashboardGrid
      initialRows={initialRows}
      onLayoutChange={handleLayoutChange}
    />
  );
}
```

## Component API

### DashboardGrid Props

| Prop | Type | Description |
|------|------|-------------|
| `initialRows` | `DashboardRow[]` | Initial layout configuration |
| `onLayoutChange` | `(rows: DashboardRow[]) => void` | Callback when layout changes |
| `className` | `string` | Additional CSS class |

### DashboardRow Interface

```tsx
interface DashboardRow {
  id: string;
  items: DashboardItem[];
}
```

### DashboardItem Interface

```tsx
interface DashboardItem {
  id: string;
  content: React.ReactNode;
  span: number; // Number of columns (1-12)
  rowId: string;
  position: number; // Column position (0-11)
}
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Key Features Implementation

1. **Grid System**: Uses CSS flexbox with `calc(8.333% - 8px)` for 12 equal columns
2. **Drag-and-Drop**: Implemented with dnd-kit for smooth interactions
3. **Visual Feedback**: Blue dashed borders highlight available drop zones
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Accessibility**: Keyboard navigation support via dnd-kit

## Browser Support

- Modern browsers with ES6+ support
- React 19+ compatible
- CSS Grid and Flexbox support required

## License

MIT