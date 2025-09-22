import React, { useState } from "react";
import { CustomDnD } from "./CustomDnD";
import type { LayoutItem } from "../types/custom-dnd";

interface TestItem {
  id: string;
  title: string;
  color: string;
}

const initialItems: TestItem[] = [
  { id: "1", title: "A", color: "#ff6b6b" },
  { id: "2", title: "B", color: "#4ecdc4" },
  { id: "3", title: "C", color: "#45b7d1" },
  { id: "4", title: "D", color: "#96ceb4" },
  { id: "5", title: "E", color: "#feca57" },
  { id: "6", title: "F", color: "#ff9ff3" },
];

const initialLayout: LayoutItem[] = [
  { id: "1", row: 0, order: 0 },
  { id: "2", row: 0, order: 1 },
  { id: "3", row: 0, order: 2 },
  { id: "4", row: 1, order: 0 },
  { id: "5", row: 1, order: 1 },
  { id: "6", row: 1, order: 2 },
];

export function TestExample() {
  const [items] = useState<TestItem[]>(initialItems);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);

  const renderItem = (item: TestItem, isDragging?: boolean) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        backgroundColor: item.color,
        color: "white",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        fontWeight: "bold",
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: isDragging 
          ? "0 8px 25px rgba(0, 0, 0, 0.3)" 
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {item.title}
    </div>
  );

  const getItemId = (item: TestItem) => item.id;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#2c3e50" }}>
          No-Shift Drag & Drop Test
        </h1>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#7f8c8d" }}>
          Items stay in place while dragging. Only blue indicators show drop position.
        </p>
        
        <CustomDnD
          items={items}
          renderItem={renderItem}
          layout={layout}
          onLayoutChange={setLayout}
          getItemId={getItemId}
          rowHeight={100}
          gap={16}
        />
        
        <div style={{ 
          marginTop: "40px", 
          backgroundColor: "white", 
          padding: "20px", 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" 
        }}>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>Layout State:</h3>
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