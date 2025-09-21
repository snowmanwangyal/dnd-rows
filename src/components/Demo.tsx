import React, { useState } from 'react';
import { Container, Title, Paper, Group, Button, Text, Stack, Box } from '@mantine/core';
import { DragDropGrid } from './DragDropGrid';
import type { GridRow } from '../types/grid';

const initialData: GridRow[] = [
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
  {
    id: 'row-3',
    items: [
      {
        id: 'item-5',
        content: 'Footer',
        width: 12,
        color: 'hsl(0, 70%, 80%)',
      },
    ],
  },
];

export const Demo: React.FC = () => {
  const [rows, setRows] = useState<GridRow[]>(initialData);

  const handleRowsChange = (newRows: GridRow[]) => {
    setRows(newRows);
    console.log('Rows updated:', newRows);
  };

  const resetToInitial = () => {
    setRows(initialData);
  };

  const addSampleData = () => {
    const newRow: GridRow = {
      id: `row-${Date.now()}`,
      items: [
        {
          id: `item-${Date.now()}-1`,
          content: 'New Item 1',
          width: 4,
          color: 'hsl(60, 70%, 80%)',
        },
        {
          id: `item-${Date.now()}-2`,
          content: 'New Item 2',
          width: 8,
          color: 'hsl(180, 70%, 80%)',
        },
      ],
    };
    setRows([...rows, newRow]);
  };

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <div>
          <Title order={1} mb="md">
            Drag & Drop Grid POC
          </Title>
          <Text c="dimmed" mb="lg">
            A flexible drag and drop grid system with 12-column layout. 
            Drag items between rows, create new rows by dropping below the last row, 
            and arrange items in any position within a row.
          </Text>
        </div>

        <Box>
          <Group mb="md">
            <Button onClick={addSampleData} size="sm">
              Add Sample Row
            </Button>
            <Button onClick={resetToInitial} size="sm" variant="light">
              Reset to Initial
            </Button>
            <Text size="sm" c="dimmed">
              Total items: {rows.reduce((acc, row) => acc + row.items.length, 0)}
            </Text>
          </Group>

          <DragDropGrid
            initialRows={rows}
            onRowsChange={handleRowsChange}
          />
        </Box>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">
            Features
          </Title>
          <Stack spacing="sm">
            <Text size="sm">
              ✅ Drag items between rows and positions
            </Text>
            <Text size="sm">
              ✅ Create new rows by dropping below the last row
            </Text>
            <Text size="sm">
              ✅ 12-column grid system with flexible item widths
            </Text>
            <Text size="sm">
              ✅ Visual feedback during drag operations
            </Text>
            <Text size="sm">
              ✅ Add/remove rows and items dynamically
            </Text>
            <Text size="sm">
              ✅ Responsive design with Mantine V6 components
            </Text>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={3} mb="md">
            Usage Instructions
          </Title>
          <Stack spacing="sm">
            <Text size="sm">
              1. <strong>Drag items:</strong> Click and drag any item to move it to a new position
            </Text>
            <Text size="sm">
              2. <strong>Create new rows:</strong> Drag an item to the drop zone below the last row
            </Text>
            <Text size="sm">
              3. <strong>Add items:</strong> Use the "Add Item" button to add new items to any row
            </Text>
            <Text size="sm">
              4. <strong>Add rows:</strong> Use the "Add Row" button or drag to the bottom drop zone
            </Text>
            <Text size="sm">
              5. <strong>Delete:</strong> Use the "Delete Row" button to remove empty rows
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};