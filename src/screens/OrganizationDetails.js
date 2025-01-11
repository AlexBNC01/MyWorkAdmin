import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

const NewPage = ({ route }) => {
  const { name: selectedOrg } = route.params;

  const { assignments, assignMachine } = useMachineContext();

  const machines = Array.from({ length: 20 }, (_, i) => `Единица ${i + 1}`);
  const drivers = Array.from({ length: 20 }, (_, i) => `Сотрудник ${i + 1}`);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Проверка доступности техники и водителей
  const isUnavailable = (item, type) => {
    return Object.values(assignments).some((orgAssignments) =>
      orgAssignments.some((assignment) => assignment[type] === item)
    );
  };

  const handleAssign = () => {
    if (selectedOrg && selectedMachine && selectedDriver) {
      assignMachine(selectedOrg, selectedMachine, selectedDriver);
      setSelectedMachine(null);
      setSelectedDriver(null);
    }
  };

  const renderGridItem = (data, selectedItem, setSelectedItem, type, icon) => (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const unavailable = isUnavailable(item, type);
        return (
          <View style={styles.gridItem}>
            <IconButton
              icon={icon}
              color={
                unavailable
                  ? '#ccc'
                  : selectedItem === item
                  ? '#007BFF'
                  : '#555'
              }
              size={24}
              onPress={() =>
                !unavailable && setSelectedItem(selectedItem === item ? null : item)
              }
            />
            <Text
              style={[
                styles.itemText,
                unavailable && styles.unavailableText,
                selectedItem === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </View>
        );
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.header}>Организация: {selectedOrg}</Text>

      <View style={styles.content}>
        {/* Слева: Рабочие единицы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Рабочие единицы</Text>
          {renderGridItem(machines, selectedMachine, setSelectedMachine, 'machine', 'hammer')}
        </View>

        {/* Справа: Персонал */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Персонал</Text>
          {renderGridItem(drivers, selectedDriver, setSelectedDriver, 'driver', 'account')}
        </View>
      </View>

      {/* Кнопка назначения */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={!selectedMachine || !selectedDriver}
          onPress={handleAssign}
          labelStyle={styles.buttonLabel}
        >
          Назначить
        </Button>
      </View>
    </View>
  );
};

export default NewPage;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 8,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#333',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    section: {
      flex: 1,
      marginHorizontal: 4,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 8,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
      color: '#007BFF',
    },
    gridItem: {
      flex: 1,
      alignItems: 'center',
      marginVertical: 8,
    },
    itemText: {
      fontSize: 14,
      textAlign: 'center',
      color: '#555',
    },
    selectedText: {
      fontWeight: 'bold',
      color: '#007BFF',
    },
    footer: {
      padding: 12,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      elevation: 2,
      marginTop: 8,
    },
    buttonLabel: {
      fontSize: 16,
    },
  });