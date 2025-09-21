import React, { useState } from 'react';
import { Button, Text, Badge, Group, Stack, Title, Paper } from '@mantine/core';
import DashboardGrid, { type DashboardItem, type DashboardRow } from './DashboardGrid';

const DashboardDemo: React.FC = () => {
  const [rows, setRows] = useState<DashboardRow[]>([
    {
      id: 'row-1',
      items: [
        {
          id: 'item-1',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Chart 1</Text>
              <Text size="xs" color="dimmed">Revenue over time</Text>
              <Badge color="green" size="sm">+12%</Badge>
            </Stack>
          ),
          span: 4,
          rowId: 'row-1',
          position: 0,
        },
        {
          id: 'item-2',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Chart 2</Text>
              <Text size="xs" color="dimmed">User engagement</Text>
              <Badge color="blue" size="sm">Active</Badge>
            </Stack>
          ),
          span: 3,
          rowId: 'row-1',
          position: 5,
        },
        {
          id: 'item-3',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Table</Text>
              <Text size="xs" color="dimmed">Recent orders</Text>
              <Badge color="orange" size="sm">24 items</Badge>
            </Stack>
          ),
          span: 5,
          rowId: 'row-1',
          position: 8,
        },
      ],
    },
    {
      id: 'row-2',
      items: [
        {
          id: 'item-4',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Metric Card</Text>
              <Text size="lg" weight={700} color="green">$12,345</Text>
              <Text size="xs" color="dimmed">Total Revenue</Text>
            </Stack>
          ),
          span: 2,
          rowId: 'row-2',
          position: 0,
        },
        {
          id: 'item-5',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Activity Feed</Text>
              <Text size="xs" color="dimmed">Latest updates</Text>
              <Badge color="purple" size="sm">3 new</Badge>
            </Stack>
          ),
          span: 6,
          rowId: 'row-2',
          position: 3,
        },
        {
          id: 'item-6',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Quick Actions</Text>
              <Group spacing="xs">
                <Button size="xs" variant="light">Export</Button>
                <Button size="xs" variant="light">Share</Button>
              </Group>
            </Stack>
          ),
          span: 4,
          rowId: 'row-2',
          position: 9,
        },
      ],
    },
    {
      id: 'row-3',
      items: [],
    },
  ]);

  const handleLayoutChange = (newRows: DashboardRow[]) => {
    setRows(newRows);
    console.log('Layout changed:', newRows);
  };

  const addSampleItem = () => {
    const newItem: DashboardItem = {
      id: `item-${Date.now()}`,
      content: (
        <Stack spacing="xs">
          <Text size="sm" weight={500}>New Item</Text>
          <Text size="xs" color="dimmed">Drag me around!</Text>
          <Badge color="cyan" size="sm">New</Badge>
        </Stack>
      ),
      span: 3,
      rowId: 'row-3',
      position: 0,
    };

    setRows(prevRows => {
      const newRows = [...prevRows];
      const targetRowIndex = newRows.findIndex(row => row.id === 'row-3');
      if (targetRowIndex !== -1) {
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          items: [...newRows[targetRowIndex].items, newItem]
        };
      }
      return newRows;
    });
  };

  const resetLayout = () => {
    setRows([
      {
        id: 'row-1',
        items: [
          {
            id: 'item-1',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Chart 1</Text>
                <Text size="xs" color="dimmed">Revenue over time</Text>
                <Badge color="green" size="sm">+12%</Badge>
              </Stack>
            ),
            span: 4,
            rowId: 'row-1',
            position: 0,
          },
          {
            id: 'item-2',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Chart 2</Text>
                <Text size="xs" color="dimmed">User engagement</Text>
                <Badge color="blue" size="sm">Active</Badge>
              </Stack>
            ),
            span: 3,
            rowId: 'row-1',
            position: 5,
          },
          {
            id: 'item-3',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Table</Text>
                <Text size="xs" color="dimmed">Recent orders</Text>
                <Badge color="orange" size="sm">24 items</Badge>
              </Stack>
            ),
            span: 5,
            rowId: 'row-1',
            position: 8,
          },
        ],
      },
      {
        id: 'row-2',
        items: [
          {
            id: 'item-4',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Metric Card</Text>
                <Text size="lg" weight={700} color="green">$12,345</Text>
                <Text size="xs" color="dimmed">Total Revenue</Text>
              </Stack>
            ),
            span: 2,
            rowId: 'row-2',
            position: 0,
          },
          {
            id: 'item-5',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Activity Feed</Text>
                <Text size="xs" color="dimmed">Latest updates</Text>
                <Badge color="purple" size="sm">3 new</Badge>
              </Stack>
            ),
            span: 6,
            rowId: 'row-2',
            position: 3,
          },
          {
            id: 'item-6',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Quick Actions</Text>
                <Group spacing="xs">
                  <Button size="xs" variant="light">Export</Button>
                  <Button size="xs" variant="light">Share</Button>
                </Group>
              </Stack>
            ),
            span: 4,
            rowId: 'row-2',
            position: 9,
          },
        ],
      },
      {
        id: 'row-3',
        items: [],
      },
    ]);
  };

  return (
    <Stack spacing="lg" p="md">
      <Paper p="md" withBorder>
        <Stack spacing="md">
          <Title order={2}>Dashboard Grid Demo</Title>
          <Text size="sm" color="dimmed">
            Drag and drop items between rows and within the 12-column grid system. 
            Visual feedback will show available drop zones during drag operations.
          </Text>
          <Group>
            <Button onClick={addSampleItem} size="sm">
              Add Sample Item
            </Button>
            <Button onClick={resetLayout} size="sm" variant="outline">
              Reset Layout
            </Button>
          </Group>
        </Stack>
      </Paper>

      <DashboardGrid
        initialRows={rows}
        onLayoutChange={handleLayoutChange}
      />
    </Stack>
  );
};

export default DashboardDemo;