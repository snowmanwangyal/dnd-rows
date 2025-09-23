import React from "react";
import { Paper, Title, Button, Group, Text } from "@mantine/core";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DashboardRow as DashboardRowType } from "../types/dashboard";
import { DashboardCardComponent } from "./DashboardCard";
import { Dropzone } from "./Dropzone";

interface DashboardRowProps {
  row: DashboardRowType;
  onAddCard: () => void;
  showDropzoneAbove?: boolean;
  showDropzoneBelow?: boolean;
  isFirstRow?: boolean;
  isLastRow?: boolean;
}

export function DashboardRowComponent({ 
  row, 
  onAddCard, 
  showDropzoneAbove = false, 
  showDropzoneBelow = false,
  isFirstRow = false,
  isLastRow = false 
}: DashboardRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: row.id,
  });

  return (
    <div>
      {/* Dropzone above row - only show if not first row */}
      {showDropzoneAbove && (
        <Dropzone
          id={`dropzone-above-${row.id}`}
          position="above"
          isVisible={true}
        />
      )}
      
      {/* Main row content */}
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
      
      {/* Dropzone below row - only show if not last row */}
      {showDropzoneBelow && (
        <Dropzone
          id={`dropzone-below-${row.id}`}
          position="below"
          isVisible={true}
        />
      )}
    </div>
  );
}
