import { Box, Card, Text } from "@mantine/core";
import { useState } from "react";
import { DnDV2 } from "./DnDV2";
import type { DnDItem, DnDLayoutItemV2, RenderItemArgs } from "./types";

interface ExampleData {
  title: string;
  content: string;
  color: string;
}

// Sample data
const sampleItems: DnDItem<ExampleData>[] = [
  {
    id: "item-1",
    data: { title: "Task 1", content: "First task description", color: "blue" },
  },
  {
    id: "item-2", 
    data: { title: "Task 2", content: "Second task description", color: "green" },
  },
  {
    id: "item-3",
    data: { title: "Task 3", content: "Third task description", color: "red" },
  },
  {
    id: "item-4",
    data: { title: "Task 4", content: "Fourth task description", color: "purple" },
  },
  {
    id: "item-5",
    data: { title: "Task 5", content: "Fifth task description", color: "orange" },
  },
];

const sampleLayout: Record<string, DnDLayoutItemV2> = {
  "item-1": { row: 1, order: 1, widthPercentage: 50 },
  "item-2": { row: 1, order: 2, widthPercentage: 50 },
  "item-3": { row: 2, order: 1, widthPercentage: 33.33 },
  "item-4": { row: 2, order: 2, widthPercentage: 33.33 },
  "item-5": { row: 2, order: 3, widthPercentage: 33.34 },
};

function ExampleItemRenderer({ item, dragging, widthPercentage }: RenderItemArgs<ExampleData>) {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      sx={(theme) => ({
        backgroundColor: dragging 
          ? theme.colors[item.data.color][1] 
          : theme.colors[item.data.color][0],
        borderColor: dragging 
          ? theme.colors[item.data.color][4] 
          : theme.colors[item.data.color][2],
        cursor: dragging ? 'grabbing' : 'grab',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        
        '&:hover': {
          transform: dragging ? 'none' : 'translateY(-2px)',
          boxShadow: dragging ? 'none' : theme.shadows.md,
        },
      })}
    >
      <Text weight={500} size="sm" color={`${item.data.color}.7`}>
        {item.data.title}
      </Text>
      <Text size="xs" color="dimmed" mt="xs">
        {item.data.content}
      </Text>
      <Text size="xs" color="dimmed" mt="auto">
        Width: {widthPercentage?.toFixed(1)}%
      </Text>
    </Card>
  );
}

export function DnDExampleV2() {
  const [items] = useState(sampleItems);
  const [layout] = useState(sampleLayout);

  return (
    <Box p="xl">
      <Text size="xl" weight={700} mb="md">
        DnD V2 Example - Resizable Items with Indicators
      </Text>
      <Text size="sm" color="dimmed" mb="xl">
        • Drag items between positions using the vertical indicators
        • Resize items by dragging the indicators left/right
        • Create new rows by dropping on horizontal indicators
        • Items automatically maintain minimum widths
      </Text>
      
      <DnDV2
        items={items}
        layout={layout}
        rowGap="lg"
        columnGap="md"
        renderItem={ExampleItemRenderer}
      />
    </Box>
  );
}