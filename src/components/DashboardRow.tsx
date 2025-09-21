import React from "react";
import { Paper, Title, Button, Group, Text } from "@mantine/core";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DashboardRow as DashboardRowType } from "../types/dashboard";
import { DashboardCardComponent } from "./DashboardCard";

interface DashboardRowProps {
  row: DashboardRowType;
  onAddCard: () => void;
}

export function DashboardRowComponent({ row, onAddCard }: DashboardRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: row.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      p="md"
      shadow="sm"
      style={{
        border: isOver ? "2px dashed #228be6" : "1px solid #e9ecef",
        backgroundColor: isOver ? "#f8f9fa" : "white",
        minHeight: "120px",
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={3}>{row.title}</Title>
        <Button size="xs" variant="outline" onClick={onAddCard}>
          Add Card
        </Button>
      </Group>

      {row.cards.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Drop cards here or click "Add Card"
        </Text>
      ) : (
        <SortableContext
          items={row.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {row.cards.map((card) => (
              <DashboardCardComponent key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      )}
    </Paper>
  );
}
