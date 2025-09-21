import { MantineProvider } from '@mantine/core';
import { Demo } from './components/Demo';
import './App.css';

function App() {
  return (
    <MantineProvider>
      <Demo />
    </MantineProvider>
  );
}

export default App
