import { MantineProvider } from "@mantine/core";
import "./App.css";
import { GridExample } from "./components/GridExample";

function App() {
  return (
    <MantineProvider>
      <GridExample />
    </MantineProvider>
  );
}

export default App;
