import React, { useState } from "react";
import { Container, Title, Paper, Group, Button, Text } from "@mantine/core";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { DashboardRow } from "../types/dashboard";
import { DashboardCard } from "../types/dashboard";
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

export function Dashboard() {
  const [rows, setRows] = useState<DashboardRow[]>(initialData);
  const [activeCard, setActiveCard] = useState<DashboardCard | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = findCardById(active.id as string);
    setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = findCardById(active.id as string);
    if (!activeCard) return;

    const overId = over.id as string;
    const overRow = findRowById(overId);
    const overCard = findCardById(overId);

    // Check if dropping on a dropzone
    if (overId.startsWith('dropzone-')) {
      handleDropOnDropzone(active.id as string, overId);
      return;
    }

    if (overCard) {
      // Dropping on another card - reorder within same row
      const activeRow = findRowContainingCard(active.id as string);
      if (activeRow && overRow && activeRow.id === overRow.id) {
        reorderCardsInRow(activeRow.id, active.id as string, over.id as string);
      } else if (activeRow && overRow && activeRow.id !== overRow.id) {
        // Move card to different row
        moveCardBetweenRows(active.id as string, overRow.id, over.id as string);
      }
    } else if (overRow) {
      // Dropping on a row - add to end of row
      const activeRow = findRowContainingCard(active.id as string);
      if (activeRow && activeRow.id !== overRow.id) {
        moveCardToRow(active.id as string, overRow.id);
      }
    }
  };

  const findCardById = (id: string): DashboardCard | null => {
    for (const row of rows) {
      const card = row.cards.find((card) => card.id === id);
      if (card) return card;
    }
    return null;
  };

  const findRowById = (id: string): DashboardRow | null => {
    return rows.find((row) => row.id === id) || null;
  };

  const findRowContainingCard = (cardId: string): DashboardRow | null => {
    return (
      rows.find((row) => row.cards.some((card) => card.id === cardId)) || null
    );
  };

  const reorderCardsInRow = (
    rowId: string,
    activeId: string,
    overId: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== rowId) return row;

        const oldIndex = row.cards.findIndex((card) => card.id === activeId);
        const newIndex = row.cards.findIndex((card) => card.id === overId);

        const newCards = [...row.cards];
        const [removed] = newCards.splice(oldIndex, 1);
        newCards.splice(newIndex, 0, removed);

        return { ...row, cards: newCards };
      })
    );
  };

  const moveCardBetweenRows = (
    cardId: string,
    targetRowId: string,
    overCardId: string
  ) => {
    setRows((prevRows) => {
      let cardToMove: DashboardCard | null = null;

      // Remove card from source row
      const updatedRows = prevRows.map((row) => {
        if (row.cards.some((card) => card.id === cardId)) {
          const cardIndex = row.cards.findIndex((card) => card.id === cardId);
          cardToMove = row.cards[cardIndex];
          return {
            ...row,
            cards: row.cards.filter((card) => card.id !== cardId),
          };
        }
        return row;
      });

      // Add card to target row at specific position
      const finalRows = updatedRows.map((row) => {
        if (row.id === targetRowId && cardToMove) {
          const overIndex = row.cards.findIndex(
            (card) => card.id === overCardId
          );
          const newCards = [...row.cards];
          newCards.splice(overIndex, 0, cardToMove);
          return { ...row, cards: newCards };
        }
        return row;
      });

      // Remove empty rows
      return finalRows.filter((row) => row.cards.length > 0);
    });
  };

  const moveCardToRow = (cardId: string, targetRowId: string) => {
    setRows((prevRows) => {
      let cardToMove: DashboardCard | null = null;

      // Remove card from source row
      const updatedRows = prevRows.map((row) => {
        if (row.cards.some((card) => card.id === cardId)) {
          const cardIndex = row.cards.findIndex((card) => card.id === cardId);
          cardToMove = row.cards[cardIndex];
          return {
            ...row,
            cards: row.cards.filter((card) => card.id !== cardId),
          };
        }
        return row;
      });

      // Add card to end of target row
      const finalRows = updatedRows.map((row) => {
        if (row.id === targetRowId && cardToMove) {
          return { ...row, cards: [...row.cards, cardToMove] };
        }
        return row;
      });

      // Remove empty rows
      return finalRows.filter((row) => row.cards.length > 0);
    });
  };

  const addNewCard = (rowId: string) => {
    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      content: "Click to edit",
      type: "metric",
      color: "gray",
    };

    setRows((prevRows) =>
      prevRows.map((row) =>
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
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDropOnDropzone = (cardId: string, dropzoneId: string) => {
    const activeRow = findRowContainingCard(cardId);
    if (!activeRow) return;

    // Handle end dropzone
    if (dropzoneId === 'dropzone-end') {
      const newRow: DashboardRow = {
        id: `row-${Date.now()}`,
        title: "New Row",
        cards: [],
      };

      setRows((prevRows) => {
        let cardToMove: DashboardCard | null = null;
        
        // Remove card from source row
        const updatedRows = prevRows.map((row) => {
          if (row.cards.some((card) => card.id === cardId)) {
            const cardIndex = row.cards.findIndex((card) => card.id === cardId);
            cardToMove = row.cards[cardIndex];
            return {
              ...row,
              cards: row.cards.filter((card) => card.id !== cardId),
            };
          }
          return row;
        });

        // Add new row with the moved card at the end
        if (cardToMove) {
          newRow.cards = [cardToMove];
          updatedRows.push(newRow);
        }

        // Remove empty rows
        return updatedRows.filter((row) => row.cards.length > 0);
      });
      return;
    }

    // Extract row ID from dropzone ID
    const rowId = dropzoneId.replace('dropzone-above-', '').replace('dropzone-below-', '');
    const isAbove = dropzoneId.includes('above');
    
    // Create new row
    const newRow: DashboardRow = {
      id: `row-${Date.now()}`,
      title: "New Row",
      cards: [],
    };

    setRows((prevRows) => {
      let cardToMove: DashboardCard | null = null;
      
      // Remove card from source row
      const updatedRows = prevRows.map((row) => {
        if (row.cards.some((card) => card.id === cardId)) {
          const cardIndex = row.cards.findIndex((card) => card.id === cardId);
          cardToMove = row.cards[cardIndex];
          return {
            ...row,
            cards: row.cards.filter((card) => card.id !== cardId),
          };
        }
        return row;
      });

      // Add new row with the moved card
      if (cardToMove) {
        newRow.cards = [cardToMove];
        
        const targetIndex = updatedRows.findIndex((row) => row.id === rowId);
        if (targetIndex !== -1) {
          const insertIndex = isAbove ? targetIndex : targetIndex + 1;
          updatedRows.splice(insertIndex, 0, newRow);
        } else {
          updatedRows.push(newRow);
        }
      }

      // Remove empty rows
      return updatedRows.filter((row) => row.cards.length > 0);
    });
  };

  const removeEmptyRows = () => {
    setRows((prevRows) => prevRows.filter((row) => row.cards.length > 0));
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Dashboard</Title>
        <Button onClick={addNewRow} variant="outline">
          Add New Row
        </Button>
      </Group>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {rows.map((row, index) => (
            <DashboardRowComponent
              key={row.id}
              row={row}
              onAddCard={() => addNewCard(row.id)}
              showDropzoneAbove={index > 0}
              showDropzoneBelow={index < rows.length - 1}
              isFirstRow={index === 0}
              isLastRow={index === rows.length - 1}
            />
          ))}
          
          {/* Dropzone at the very end for creating new row at bottom */}
          {rows.length > 0 && (
            <Dropzone
              id="dropzone-end"
              position="below"
              isVisible={true}
            />
          )}
        </div>

        <DragOverlay>
          {activeCard ? (
            <DashboardCardComponent card={activeCard} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}
