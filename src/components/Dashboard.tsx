import React, { useState, useCallback, useRef, useEffect } from "react";
import { Container, Title, Group, Button } from "@mantine/core";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import type { DashboardRow, DashboardCard } from "../types/dashboard";
import { DashboardRowComponent } from "./DashboardRow";
import { DashboardCardComponent } from "./DashboardCard";

const initialData: DashboardRow[] = [
  {
    id: "row-1",
    title: "Key Metrics",
    cards: [
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
    ],
  },
  {
    id: "row-2",
    title: "Analytics",
    cards: [
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
    ],
  },
  {
    id: "row-3",
    title: "Recent Activity",
    cards: [
      {
        id: "card-6",
        title: "Recent Events",
        content: "List of recent user events",
        type: "list",
        color: "pink",
      },
    ],
  },
];

// Convert rows to items format for dnd-kit
type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

// const animateLayoutChanges: AnimateLayoutChanges = (args: any) => 
//   defaultAnimateLayoutChanges({...args, wasDragging: true});

export function Dashboard() {
  const [rows, setRows] = useState<DashboardRow[]>(initialData);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [containers, setContainers] = useState<UniqueIdentifier[]>(
    initialData.map(row => row.id)
  );
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  // Convert rows to items format
  const items: Items = rows.reduce((acc: Items, row: DashboardRow) => {
    acc[row.id] = row.cards.map((card: DashboardCard) => card.id);
    return acc;
  }, {} as Items);

  // const isSortingContainer = activeId != null ? containers.includes(activeId) : false;

  // Custom collision detection strategy optimized for multiple containers
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args: any) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container: any) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections = pointerIntersections.length > 0
        ? pointerIntersections
        : rectIntersection(args);

      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId];
          // If a container is matched and it contains items
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container: any) => container.id !== overId && containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }
        lastOverId.current = overId;
        return [{id: overId}];
      }

      // When a draggable item moves to a new container, the layout may shift
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{id: lastOverId.current}] : [];
    },
    [activeId, items]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const findCardById = (id: string): DashboardCard | null => {
    for (const row of rows) {
      const card = row.cards.find((card: DashboardCard) => card.id === id);
      if (card) return card;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setRows((prevRows: DashboardRow[]) => {
        const activeRow = prevRows.find((row: DashboardRow) => row.id === activeContainer);
        const overRow = prevRows.find((row: DashboardRow) => row.id === overContainer);
        
        if (!activeRow || !overRow) return prevRows;

        const activeItems = activeRow.cards;
        const overItems = overRow.cards;
        const overIndex = overItems.findIndex((card: DashboardCard) => card.id === overId);
        const activeIndex = activeItems.findIndex((card: DashboardCard) => card.id === active.id);

        let newIndex: number;
        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem = over && active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        recentlyMovedToNewContainer.current = true;

        return prevRows.map((row: DashboardRow) => {
          if (row.id === activeContainer) {
            return {
              ...row,
              cards: row.cards.filter((card: DashboardCard) => card.id !== active.id)
            };
          }
          if (row.id === overContainer) {
            const activeCard = activeItems[activeIndex];
            const newCards = [...row.cards];
            newCards.splice(newIndex, 0, activeCard);
            return {
              ...row,
              cards: newCards
            };
          }
          return row;
        });
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id in items && over?.id) {
      setContainers((containers: UniqueIdentifier[]) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);
        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);
    if (!activeContainer) {
      return;
    }

    const overId = over?.id;
    if (overId == null) {
      return;
    }

    const overContainer = findContainer(overId);
    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);
      
      if (activeIndex !== overIndex) {
        setRows((prevRows: DashboardRow[]) => {
          const overRow = prevRows.find((row: DashboardRow) => row.id === overContainer);
          if (!overRow) return prevRows;

          const newCards = arrayMove(overRow.cards, activeIndex, overIndex);
          return prevRows.map((row: DashboardRow) => 
            row.id === overContainer 
              ? { ...row, cards: newCards }
              : row
          );
        });
      }
    }
  };

  const addNewCard = (rowId: string) => {
    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      content: "Click to edit",
      type: "metric",
      color: "gray",
    };

    setRows((prevRows: DashboardRow[]) =>
      prevRows.map((row: DashboardRow) =>
        row.id === rowId ? { ...row, cards: [...row.cards, newCard] } : row
      )
    );
  };

  const addNewRow = () => {
    const newRow: DashboardRow = {
      id: `row-${Date.now()}`,
      title: "New Row",
      cards: [],
    };
    setRows((prevRows: DashboardRow[]) => [...prevRows, newRow]);
    setContainers((prev: UniqueIdentifier[]) => [...prev, newRow.id]);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Dashboard</Title>
        <Button onClick={addNewRow} variant="outline">
          Add New Row
        </Button>
      </Group>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {containers.map((containerId: UniqueIdentifier) => (
            <DashboardRowComponent
              key={containerId}
              row={rows.find((row: DashboardRow) => row.id === containerId)!}
              onAddCard={() => addNewCard(containerId as string)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <DashboardCardComponent 
              card={findCardById(activeId as string)!} 
              isDragging 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}
