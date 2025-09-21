# Dashboard Drag & Drop Demo

A modern dashboard with draggable cards built with React, TypeScript, Mantine V6, and dnd-kit. This demo showcases a Mixpanel-like dashboard where cards can be dragged and reordered within rows and moved between different rows.

## Features

- ✅ **Draggable cards** that can be reordered within rows
- ✅ **Move cards between rows** by dragging them to different sections
- ✅ **Visual feedback** during drag operations with drag overlay
- ✅ **Add new cards** to any row dynamically
- ✅ **Add new rows** to organize cards
- ✅ **Modern UI** with Mantine V6 components
- ✅ **TypeScript support** with full type safety
- ✅ **Responsive design** that works on all screen sizes

## Installation

```bash
npm install @mantine/core@6 @mantine/hooks@6 @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Usage

```tsx
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <MantineProvider>
      <Dashboard />
    </MantineProvider>
  );
}
```

## Component Structure

### Core Components

- **`Dashboard`** - Main container with drag and drop context
- **`DashboardRow`** - Individual row component for organizing cards
- **`DashboardCard`** - Draggable card component with different types

### Types

```typescript
interface DashboardCard {
  id: string;
  title: string;
  content: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  color: string;
}

interface DashboardRow {
  id: string;
  title: string;
  cards: DashboardCard[];
}
```

## Key Features Explained

### Drag and Drop
- **Reorder within rows**: Drag cards to reorder them within the same row
- **Move between rows**: Drag cards to different rows to reorganize your dashboard
- **Visual feedback**: See drag overlay and drop zone highlighting during operations

### Card Types
- **Metrics**: Display key numbers and statistics
- **Charts**: Visual data representations
- **Tables**: Structured data display
- **Lists**: Itemized information

### Dynamic Management
- **Add cards**: Click "Add Card" button in any row
- **Add rows**: Click "Add New Row" to create new sections
- **Edit cards**: Click the edit icon on any card (placeholder functionality)

## Styling

The dashboard uses Mantine V6's design system with:
- Clean, modern card layouts
- Color-coded card types
- Smooth drag and drop animations
- Responsive grid system
- Professional dashboard appearance

## Browser Support

- Modern browsers with ES6+ support
- React 18+
- TypeScript 4.5+

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo Features

This demo includes:
1. **Pre-populated data** with sample cards in different categories
2. **Interactive drag and drop** - try dragging cards around!
3. **Add functionality** - add new cards and rows
4. **Visual feedback** - see the drag overlay and drop zones
5. **Responsive design** - works on desktop and mobile

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser and start dragging cards around!

The dashboard is ready to use and can be easily customized for your specific needs.