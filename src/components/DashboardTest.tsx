import React, { useState } from 'react';
import { Button, Text, Badge, Group, Stack, Title, Paper, Alert, Code } from '@mantine/core';
import DashboardGrid, { type DashboardItem, type DashboardRow } from './DashboardGrid';

const DashboardTest: React.FC = () => {
  const [rows, setRows] = useState<DashboardRow[]>([
    {
      id: 'test-row-1',
      items: [
        {
          id: 'test-item-1',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Test Item 1</Text>
              <Text size="xs" color="dimmed">Drag me to test positioning</Text>
              <Badge color="blue" size="sm">Position: 0</Badge>
            </Stack>
          ),
          span: 3,
          rowId: 'test-row-1',
          position: 0,
        },
        {
          id: 'test-item-2',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Test Item 2</Text>
              <Text size="xs" color="dimmed">Wide item spanning 6 columns</Text>
              <Badge color="green" size="sm">Position: 4</Badge>
            </Stack>
          ),
          span: 6,
          rowId: 'test-row-1',
          position: 4,
        },
        {
          id: 'test-item-3',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Test Item 3</Text>
              <Text size="xs" color="dimmed">Small item at end</Text>
              <Badge color="orange" size="sm">Position: 10</Badge>
            </Stack>
          ),
          span: 2,
          rowId: 'test-row-1',
          position: 10,
        },
      ],
    },
    {
      id: 'test-row-2',
      items: [
        {
          id: 'test-item-4',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Test Item 4</Text>
              <Text size="xs" color="dimmed">Full width item</Text>
              <Badge color="purple" size="sm">Position: 0, Span: 12</Badge>
            </Stack>
          ),
          span: 12,
          rowId: 'test-row-2',
          position: 0,
        },
      ],
    },
    {
      id: 'test-row-3',
      items: [],
    },
  ]);

  const [layoutHistory, setLayoutHistory] = useState<DashboardRow[][]>([]);

  const handleLayoutChange = (newRows: DashboardRow[]) => {
    setRows(newRows);
    setLayoutHistory(prev => [...prev, newRows]);
    console.log('Layout changed:', newRows);
  };

  const addTestItem = (span: number, position: number) => {
    const newItem: DashboardItem = {
      id: `test-item-${Date.now()}`,
      content: (
        <Stack spacing="xs">
          <Text size="sm" weight={500}>New Test Item</Text>
          <Text size="xs" color="dimmed">Span: {span}, Pos: {position}</Text>
          <Badge color="cyan" size="sm">New</Badge>
        </Stack>
      ),
      span,
      rowId: 'test-row-3',
      position,
    };

    setRows(prevRows => {
      const newRows = [...prevRows];
      const targetRowIndex = newRows.findIndex(row => row.id === 'test-row-3');
      if (targetRowIndex !== -1) {
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          items: [...newRows[targetRowIndex].items, newItem]
        };
      }
      return newRows;
    });
  };

  const clearEmptyRow = () => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      const targetRowIndex = newRows.findIndex(row => row.id === 'test-row-3');
      if (targetRowIndex !== -1) {
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          items: []
        };
      }
      return newRows;
    });
  };

  const resetToDefault = () => {
    setRows([
      {
        id: 'test-row-1',
        items: [
          {
            id: 'test-item-1',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Test Item 1</Text>
                <Text size="xs" color="dimmed">Drag me to test positioning</Text>
                <Badge color="blue" size="sm">Position: 0</Badge>
              </Stack>
            ),
            span: 3,
            rowId: 'test-row-1',
            position: 0,
          },
          {
            id: 'test-item-2',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Test Item 2</Text>
                <Text size="xs" color="dimmed">Wide item spanning 6 columns</Text>
                <Badge color="green" size="sm">Position: 4</Badge>
              </Stack>
            ),
            span: 6,
            rowId: 'test-row-1',
            position: 4,
          },
          {
            id: 'test-item-3',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Test Item 3</Text>
                <Text size="xs" color="dimmed">Small item at end</Text>
                <Badge color="orange" size="sm">Position: 10</Badge>
              </Stack>
            ),
            span: 2,
            rowId: 'test-row-1',
            position: 10,
          },
        ],
      },
      {
        id: 'test-row-2',
        items: [
          {
            id: 'test-item-4',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Test Item 4</Text>
                <Text size="xs" color="dimmed">Full width item</Text>
                <Badge color="purple" size="sm">Position: 0, Span: 12</Badge>
              </Stack>
            ),
            span: 12,
            rowId: 'test-row-2',
            position: 0,
          },
        ],
      },
      {
        id: 'test-row-3',
        items: [],
      },
    ]);
    setLayoutHistory([]);
  };

  return (
    <Stack spacing="lg" p="md">
      <Paper p="md" withBorder>
        <Stack spacing="md">
          <Title order={2}>Dashboard Grid Test Suite</Title>
          <Text size="sm" color="dimmed">
            This test suite demonstrates the drag-and-drop functionality with various item sizes and positions.
            Use the buttons below to add test items with different spans and positions.
          </Text>
          
          <Alert color="blue" title="Test Instructions">
            <Text size="sm">
              1. Drag items between rows to test vertical movement<br/>
              2. Drag items within rows to test horizontal positioning<br/>
              3. Watch for visual feedback during drag operations<br/>
              4. Check the console for layout change events
            </Text>
          </Alert>

          <Group>
            <Button onClick={() => addTestItem(3, 0)} size="sm">
              Add 3-span item at position 0
            </Button>
            <Button onClick={() => addTestItem(4, 3)} size="sm">
              Add 4-span item at position 3
            </Button>
            <Button onClick={() => addTestItem(2, 8)} size="sm">
              Add 2-span item at position 8
            </Button>
            <Button onClick={() => addTestItem(6, 0)} size="sm">
              Add 6-span item at position 0
            </Button>
            <Button onClick={clearEmptyRow} size="sm" variant="outline">
              Clear Empty Row
            </Button>
            <Button onClick={resetToDefault} size="sm" variant="outline">
              Reset to Default
            </Button>
          </Group>

          {layoutHistory.length > 0 && (
            <Alert color="green" title="Layout Changes">
              <Text size="sm">
                Layout has been changed {layoutHistory.length} time(s). 
                Check the browser console for detailed change logs.
              </Text>
            </Alert>
          )}
        </Stack>
      </Paper>

      <DashboardGrid
        initialRows={rows}
        onLayoutChange={handleLayoutChange}
      />

      <Paper p="md" withBorder>
        <Stack spacing="md">
          <Title order={3}>Current Layout State</Title>
          <Code block>
            {JSON.stringify(rows, null, 2)}
          </Code>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DashboardTest;