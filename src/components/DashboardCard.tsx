import { Paper, Text, Badge, Group, ActionIcon } from "@mantine/core";
import type { DashboardCard as DashboardCardType } from "../types/dashboard";

interface DashboardCardProps {
  card: DashboardCardType;
  isDragging?: boolean;
}

export function DashboardCardComponent({
  card,
  isDragging = false,
}: DashboardCardProps) {


  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chart":
        return "📊";
      case "metric":
        return "📈";
      case "table":
        return "📋";
      case "list":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <Paper
      style={{
        width: "200px",
        minHeight: "120px",
        cursor: "grab",
        border: isDragging ? "2px solid #228be6" : "1px solid #e9ecef",
        boxShadow: isDragging
          ? "0 4px 12px rgba(0, 0, 0, 0.15)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
        transform: isDragging ? "rotate(5deg)" : undefined,
      }}
      p="md"
    >
      <Group mb="xs" style={{ justifyContent: "space-between" }}>
        <Text fw={600} size="sm" truncate>
          {card.title}
        </Text>
        <Badge size="xs" color={card.color} variant="light">
          {getTypeIcon(card.type)}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" style={{ minHeight: "40px" }}>
        {card.content}
      </Text>

      <Group mt="xs" style={{ justifyContent: "flex-end" }}>
        <ActionIcon
          size="xs"
          variant="subtle"
          color="gray"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            // Handle edit action
          }}
        >
          ✏️
        </ActionIcon>
      </Group>
    </Paper>
  );
}
