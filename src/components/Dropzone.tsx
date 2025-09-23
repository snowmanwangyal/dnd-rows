import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Paper, Text } from "@mantine/core";

interface DropzoneProps {
  id: string;
  position: "above" | "below";
  isVisible: boolean;
}

export function Dropzone({ id, position, isVisible }: DropzoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  if (!isVisible) return null;

  return (
    <div
      ref={setNodeRef}
      style={{
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: isOver ? "2px dashed #228be6" : "2px dashed transparent",
        backgroundColor: isOver ? "#f8f9fa" : "transparent",
        borderRadius: "4px",
        margin: "8px 0",
        transition: "all 0.2s ease",
        opacity: isOver ? 1 : 0.3,
        position: "relative",
      }}
    >
      {isOver && (
        <Text
          size="xs"
          c="blue"
          fw={600}
          style={{
            position: "absolute",
            backgroundColor: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          Drop here to create new row
        </Text>
      )}
    </div>
  );
}