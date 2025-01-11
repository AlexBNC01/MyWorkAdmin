import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { MachineProvider } from './src/context/MachineContext';

export default function App() {
  return (
    <MachineProvider>
      <AppNavigator />
    </MachineProvider>
  );
}
