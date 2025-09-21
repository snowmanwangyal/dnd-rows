import React, { useState } from 'react';
import { Button, Text, Badge, Group, Stack, Title, Paper, SimpleGrid } from '@mantine/core';
import DashboardGrid, { type DashboardItem, type DashboardRow } from './DashboardGrid';

const DashboardExamples: React.FC = () => {
  const [rows, setRows] = useState<DashboardRow[]>([
    {
      id: 'analytics',
      items: [
        {
          id: 'revenue-chart',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Revenue Chart</Text>
              <Text size="xs" color="dimmed">Monthly revenue trends</Text>
              <Badge color="green" size="sm">+15.2%</Badge>
            </Stack>
          ),
          span: 6,
          rowId: 'analytics',
          position: 0,
        },
        {
          id: 'user-metrics',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>User Metrics</Text>
              <Text size="xs" color="dimmed">Active users this month</Text>
              <Badge color="blue" size="sm">2,847</Badge>
            </Stack>
          ),
          span: 3,
          rowId: 'analytics',
          position: 6,
        },
        {
          id: 'conversion-rate',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Conversion Rate</Text>
              <Text size="xs" color="dimmed">Last 30 days</Text>
              <Badge color="orange" size="sm">3.2%</Badge>
            </Stack>
          ),
          span: 3,
          rowId: 'analytics',
          position: 9,
        },
      ],
    },
    {
      id: 'operations',
      items: [
        {
          id: 'recent-orders',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Recent Orders</Text>
              <Text size="xs" color="dimmed">Latest customer orders</Text>
              <SimpleGrid cols={2} spacing="xs">
                <Badge color="green" size="sm">24 New</Badge>
                <Badge color="yellow" size="sm">8 Pending</Badge>
              </SimpleGrid>
            </Stack>
          ),
          span: 8,
          rowId: 'operations',
          position: 0,
        },
        {
          id: 'quick-actions',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Quick Actions</Text>
              <Group spacing="xs">
                <Button size="xs" variant="light">Export</Button>
                <Button size="xs" variant="light">Filter</Button>
              </Group>
            </Stack>
          ),
          span: 4,
          rowId: 'operations',
          position: 8,
        },
      ],
    },
    {
      id: 'monitoring',
      items: [
        {
          id: 'system-health',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>System Health</Text>
              <Text size="xs" color="dimmed">Server status and performance</Text>
              <Badge color="green" size="sm">All Systems Operational</Badge>
            </Stack>
          ),
          span: 4,
          rowId: 'monitoring',
          position: 0,
        },
        {
          id: 'alerts',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Alerts</Text>
              <Text size="xs" color="dimmed">System notifications</Text>
              <Badge color="red" size="sm">2 Critical</Badge>
            </Stack>
          ),
          span: 4,
          rowId: 'monitoring',
          position: 4,
        },
        {
          id: 'performance',
          content: (
            <Stack spacing="xs">
              <Text size="sm" weight={500}>Performance</Text>
              <Text size="xs" color="dimmed">Response times</Text>
              <Badge color="blue" size="sm">45ms avg</Badge>
            </Stack>
          ),
          span: 4,
          rowId: 'monitoring',
          position: 8,
        },
      ],
    },
    {
      id: 'empty-row',
      items: [],
    },
  ]);

  const handleLayoutChange = (newRows: DashboardRow[]) => {
    setRows(newRows);
    console.log('Layout changed:', newRows);
  };

  const addSampleWidget = (type: string) => {
    const newItem: DashboardItem = {
      id: `widget-${Date.now()}`,
      content: (
        <Stack spacing="xs">
          <Text size="sm" weight={500}>{type} Widget</Text>
          <Text size="xs" color="dimmed">Drag me around!</Text>
          <Badge color="cyan" size="sm">New</Badge>
        </Stack>
      ),
      span: 3,
      rowId: 'empty-row',
      position: 0,
    };

    setRows(prevRows => {
      const newRows = [...prevRows];
      const targetRowIndex = newRows.findIndex(row => row.id === 'empty-row');
      if (targetRowIndex !== -1) {
        newRows[targetRowIndex] = {
          ...newRows[targetRowIndex],
          items: [...newRows[targetRowIndex].items, newItem]
        };
      }
      return newRows;
    });
  };

  const resetToDefault = () => {
    setRows([
      {
        id: 'analytics',
        items: [
          {
            id: 'revenue-chart',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Revenue Chart</Text>
                <Text size="xs" color="dimmed">Monthly revenue trends</Text>
                <Badge color="green" size="sm">+15.2%</Badge>
              </Stack>
            ),
            span: 6,
            rowId: 'analytics',
            position: 0,
          },
          {
            id: 'user-metrics',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>User Metrics</Text>
                <Text size="xs" color="dimmed">Active users this month</Text>
                <Badge color="blue" size="sm">2,847</Badge>
              </Stack>
            ),
            span: 3,
            rowId: 'analytics',
            position: 6,
          },
          {
            id: 'conversion-rate',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Conversion Rate</Text>
                <Text size="xs" color="dimmed">Last 30 days</Text>
                <Badge color="orange" size="sm">3.2%</Badge>
              </Stack>
            ),
            span: 3,
            rowId: 'analytics',
            position: 9,
          },
        ],
      },
      {
        id: 'operations',
        items: [
          {
            id: 'recent-orders',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Recent Orders</Text>
                <Text size="xs" color="dimmed">Latest customer orders</Text>
                <SimpleGrid cols={2} spacing="xs">
                  <Badge color="green" size="sm">24 New</Badge>
                  <Badge color="yellow" size="sm">8 Pending</Badge>
                </SimpleGrid>
              </Stack>
            ),
            span: 8,
            rowId: 'operations',
            position: 0,
          },
          {
            id: 'quick-actions',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Quick Actions</Text>
                <Group spacing="xs">
                  <Button size="xs" variant="light">Export</Button>
                  <Button size="xs" variant="light">Filter</Button>
                </Group>
              </Stack>
            ),
            span: 4,
            rowId: 'operations',
            position: 8,
          },
        ],
      },
      {
        id: 'monitoring',
        items: [
          {
            id: 'system-health',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>System Health</Text>
                <Text size="xs" color="dimmed">Server status and performance</Text>
                <Badge color="green" size="sm">All Systems Operational</Badge>
              </Stack>
            ),
            span: 4,
            rowId: 'monitoring',
            position: 0,
          },
          {
            id: 'alerts',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Alerts</Text>
                <Text size="xs" color="dimmed">System notifications</Text>
                <Badge color="red" size="sm">2 Critical</Badge>
              </Stack>
            ),
            span: 4,
            rowId: 'monitoring',
            position: 4,
          },
          {
            id: 'performance',
            content: (
              <Stack spacing="xs">
                <Text size="sm" weight={500}>Performance</Text>
                <Text size="xs" color="dimmed">Response times</Text>
                <Badge color="blue" size="sm">45ms avg</Badge>
              </Stack>
            ),
            span: 4,
            rowId: 'monitoring',
            position: 8,
          },
        ],
      },
      {
        id: 'empty-row',
        items: [],
      },
    ]);
  };

  return (
    <Stack spacing="lg" p="md">
      <Paper p="md" withBorder>
        <Stack spacing="md">
          <Title order={2}>Advanced Dashboard Examples</Title>
          <Text size="sm" color="dimmed">
            This dashboard demonstrates various widget types and layouts. 
            Drag items between rows and within the 12-column grid system.
          </Text>
          <Group>
            <Button onClick={() => addSampleWidget('Chart')} size="sm">
              Add Chart Widget
            </Button>
            <Button onClick={() => addSampleWidget('Table')} size="sm">
              Add Table Widget
            </Button>
            <Button onClick={() => addSampleWidget('Metric')} size="sm">
              Add Metric Widget
            </Button>
            <Button onClick={resetToDefault} size="sm" variant="outline">
              Reset to Default
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

export default DashboardExamples;