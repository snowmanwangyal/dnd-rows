import { MantineProvider } from "@mantine/core";
import "./App.css";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <MantineProvider>
      <Dashboard />
    </MantineProvider>
  );
}

export default App;
