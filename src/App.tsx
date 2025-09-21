import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import DashboardTest from './components/DashboardTest';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <DashboardTest />
    </MantineProvider>
  )
}

export default App
