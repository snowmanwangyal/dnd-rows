import React, { useState } from "react";
import { CustomDnD } from "./CustomDnD";
import type { LayoutItem } from "../types/custom-dnd";

interface ExampleItem {
  id: string;
  title: string;
  content: string;
}

const initialItems: ExampleItem[] = [
  { id: "1", title: "Item 1", content: "Content 1" },
  { id: "2", title: "Item 2", content: "Content 2" },
  { id: "3", title: "Item 3", content: "Content 3" },
  { id: "4", title: "Item 4", content: "Content 4" },
  { id: "5", title: "Item 5", content: "Content 5" },
  { id: "6", title: "Item 6", content: "Content 6" },
];

const initialLayout: LayoutItem[] = [
  { id: "1", row: 0, order: 0 },
  { id: "2", row: 0, order: 1 },
  { id: "3", row: 0, order: 2 },
  { id: "4", row: 1, order: 0 },
  { id: "5", row: 1, order: 1 },
  { id: "6", row: 1, order: 2 },
];

export function ExampleUsage() {
  const [items] = useState<ExampleItem[]>(initialItems);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);

  const renderItem = (item: ExampleItem, isDragging?: boolean) => (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        backgroundColor: isDragging ? "#e3f2fd" : "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{item.title}</h3>
      <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{item.content}</p>
    </div>
  );

  const getItemId = (item: ExampleItem) => item.id;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Custom DnD with CSS-based Drop Indicators</h1>
      <p>Drag and drop items between rows. The blue indicators show where items will be placed.</p>
      
      <CustomDnD
        items={items}
        renderItem={renderItem}
        layout={layout}
        onLayoutChange={setLayout}
        getItemId={getItemId}
        rowHeight={120}
        gap={16}
      />
      
      <div style={{ marginTop: "20px" }}>
        <h3>Current Layout:</h3>
        <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>
          {JSON.stringify(layout, null, 2)}
        </pre>
      </div>
    </div>
  );
}