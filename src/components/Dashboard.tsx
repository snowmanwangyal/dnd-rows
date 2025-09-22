import { useState } from "react";
import { Container, Title, Group, Button } from "@mantine/core";
import type { DashboardCard } from "../types/dashboard";
import { DashboardCardComponent } from "./DashboardCard";
import { CustomDnD } from "./CustomDnD";
import type { LayoutItem } from "../types/custom-dnd";

const initialData: DashboardCard[] = [
  {
    id: "card-1",
    title: "Total Users",
    content: "1,234",
    type: "metric",
    color: "blue",
  },
  {
    id: "card-2",
    title: "Revenue",
    content: "$12,345",
    type: "metric",
    color: "green",
  },
  {
    id: "card-3",
    title: "Conversion Rate",
    content: "3.2%",
    type: "metric",
    color: "orange",
  },
  {
    id: "card-4",
    title: "User Growth Chart",
    content: "Line chart showing user growth over time",
    type: "chart",
    color: "purple",
  },
  {
    id: "card-5",
    title: "Top Pages",
    content: "Table showing most visited pages",
    type: "table",
    color: "cyan",
  },
  {
    id: "card-6",
    title: "Recent Events",
    content: "List of recent user events",
    type: "list",
    color: "pink",
  },
];

const initialLayout: LayoutItem[] = [
  { id: "card-1", row: 0, order: 0, width: 0.33 },
  { id: "card-2", row: 0, order: 1, width: 0.33 },
  { id: "card-3", row: 0, order: 2, width: 0.33 },
  { id: "card-4", row: 1, order: 0, width: 0.5 },
  { id: "card-5", row: 1, order: 1, width: 0.5 },
  { id: "card-6", row: 2, order: 0, width: 1.0 },
];

export function Dashboard() {
  const [cards, setCards] = useState<DashboardCard[]>(initialData);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayout(newLayout);
  };

  const handleItemsChange = (newItems: DashboardCard[]) => {
    setCards(newItems);
  };

  const addNewCard = () => {
    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      content: "Click to edit",
      type: "metric",
      color: "gray",
    };

    const newLayoutItem: LayoutItem = {
      id: newCard.id,
      row: 0,
      order: 0,
      width: 0.33,
    };

    setCards((prev: DashboardCard[]) => [newCard, ...prev]);
    setLayout((prev: LayoutItem[]) => [newLayoutItem, ...prev]);
  };

  const renderCard = (card: DashboardCard, isDragging?: boolean) => (
    <DashboardCardComponent card={card} isDragging={isDragging} />
  );

  return (
    <Container size="xl" py="md">
      <Group mb="xl" style={{ justifyContent: "space-between" }}>
        <Title order={1}>Dashboard</Title>
        <Button onClick={addNewCard} variant="outline">
          Add New Card
        </Button>
      </Group>

      <CustomDnD
        items={cards}
        renderItem={renderCard}
        layout={layout}
        onLayoutChange={handleLayoutChange}
        onItemsChange={handleItemsChange}
        getItemId={(card) => card.id}
        rowHeight={120}
        gap={16}
      />
    </Container>
  );
}
