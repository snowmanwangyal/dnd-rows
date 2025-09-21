export interface DashboardCard {
  id: string;
  title: string;
  content: string;
  type: "chart" | "metric" | "table" | "list";
  color: string;
}

export interface DashboardRow {
  id: string;
  title: string;
  cards: DashboardCard[];
}

export interface DashboardData {
  rows: DashboardRow[];
}
