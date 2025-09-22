import { MantineProvider } from "@mantine/core";
import "./App.css";
import { TestExample } from "./components/TestExample";

function App() {
  return (
    <MantineProvider>
      <TestExample />
    </MantineProvider>
  );
}

export default App;
