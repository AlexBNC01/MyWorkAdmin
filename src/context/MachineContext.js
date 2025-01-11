import React, { createContext, useState, useContext } from 'react';

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [assignments, setAssignments] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const assignMachine = (orgName, machine, driver) => {
    setAssignments((prev) => ({
      ...prev,
      [orgName]: [...(prev[orgName] || []), { machine, driver }],
    }));
  };

  return (
    <MachineContext.Provider
      value={{
        assignments,
        setAssignments,
        selectedItems,
        setSelectedItems,
        assignMachine,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachineContext = () => useContext(MachineContext);