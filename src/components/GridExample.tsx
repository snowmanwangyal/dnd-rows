import React, { useState } from "react";
import { CustomDnD } from "./CustomDnD";
import type { LayoutItem } from "../types/custom-dnd";

interface GridItem {
  id: string;
  title: string;
  color: string;
}

const initialItems: GridItem[] = [
  { id: "1", title: "Card 1", color: "#ff6b6b" },
  { id: "2", title: "Card 2", color: "#4ecdc4" },
  { id: "3", title: "Card 3", color: "#45b7d1" },
  { id: "4", title: "Card 4", color: "#96ceb4" },
  { id: "5", title: "Card 5", color: "#feca57" },
  { id: "6", title: "Card 6", color: "#ff9ff3" },
  { id: "7", title: "Card 7", color: "#54a0ff" },
  { id: "8", title: "Card 8", color: "#5f27cd" },
  { id: "9", title: "Card 9", color: "#00d2d3" },
];

const initialLayout: LayoutItem[] = [
  { id: "1", row: 0, order: 0 },
  { id: "2", row: 0, order: 1 },
  { id: "3", row: 0, order: 2 },
  { id: "4", row: 1, order: 0 },
  { id: "5", row: 1, order: 1 },
  { id: "6", row: 1, order: 2 },
  { id: "7", row: 2, order: 0 },
  { id: "8", row: 2, order: 1 },
  { id: "9", row: 2, order: 2 },
];

export function GridExample() {
  const [items] = useState<GridItem[]>(initialItems);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);

  const renderItem = (item: GridItem, isDragging?: boolean) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        backgroundColor: item.color,
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: isDragging 
          ? "0 8px 25px rgba(0, 0, 0, 0.3)" 
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {item.title}
    </div>
  );

  const getItemId = (item: GridItem) => item.id;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#2c3e50" }}>
          Grid Layout with CSS Drop Indicators
        </h1>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#7f8c8d" }}>
          Drag and drop cards to reorder them. Blue indicators show where items will be placed.
        </p>
        
        <CustomDnD
          items={items}
          renderItem={renderItem}
          layout={layout}
          onLayoutChange={setLayout}
          getItemId={getItemId}
          rowHeight={150}
          gap={20}
        />
        
        <div style={{ marginTop: "40px", backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Current Layout State:</h3>
          <pre style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "4px", 
            overflow: "auto",
            fontSize: "12px",
            border: "1px solid #e9ecef"
          }}>
            {JSON.stringify(layout, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}