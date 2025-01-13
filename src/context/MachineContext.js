// src/context/MachineContext.js

import React, { createContext, useState, useContext } from 'react';

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  // assignments: { [dateString]: { [orgName]: Array<{ machine, driver }> } }
  const [assignments, setAssignments] = useState({});
  
  // Глобальная выбранная дата для назначения (используется в OrganizationList и NewPage)
  const [selectedDate, setSelectedDate] = useState('');

  // Функция записи назначений
  const assignMachine = (orgName, machine, driver, dateString) => {
    if (!dateString) {
      console.warn('assignMachine вызвана без dateString');
      return;
    }
    setAssignments((prev) => {
      const dayData = prev[dateString] || {};
      const orgData = dayData[orgName] || [];
      return {
        ...prev,
        [dateString]: {
          ...dayData,
          [orgName]: [...orgData, { machine, driver }],
        },
      };
    });
  };

  // Функция удаления назначений (машины/водителя) в рамках указанной организации и даты
  const removeAssignmentsForItem = (orgName, item, type, dateString) => {
    if (!dateString) {
      console.warn('removeAssignmentsForItem вызвана без dateString');
      return;
    }
    setAssignments((prev) => {
      const dayData = prev[dateString] || {};
      const orgData = dayData[orgName] || [];

      // Убираем все записи, где machine (или driver) совпадает с 'item'
      const newOrgData = orgData.filter((asmt) =>
        type === 'machines'
          ? asmt.machine !== item
          : asmt.driver !== item
      );

      return {
        ...prev,
        [dateString]: {
          ...dayData,
          [orgName]: newOrgData,
        },
      };
    });
  };

  return (
    <MachineContext.Provider
      value={{
        assignments,
        setAssignments,

        selectedDate,
        setSelectedDate,

        assignMachine,
        removeAssignmentsForItem, // <-- ВАЖНО: обязательно экспортируем!
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachineContext = () => useContext(MachineContext);