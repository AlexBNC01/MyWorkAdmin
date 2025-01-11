import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, DataTable } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

// Справочник: какая машина к какой категории относится
const machineCategories = {
  'КМУ': ['938', '169', '671', '186'],
  'МТЗ': ['3990', '4227', '8826', '9199', '0279','4220','7751', '5393', '6245','4399','4159'],
  'ЭП':  ['3581', '3003', '1434', '1435','4978', '7229', '8766'],
  'ФП':  ['0366'],
  'HY':  ['4977'],
  'Кран': ['Sany'],
};

// Функция поиска категории
function findCategoryForMachine(machine) {
  // Перебираем категории, проверяем, в чьём массиве есть эта машина
  for (const categoryName in machineCategories) {
    if (machineCategories[categoryName].includes(machine)) {
      return categoryName;
    }
  }
  return '—'; // если не нашли, вернём прочерк
}

const Assignments = () => {
  const { assignments } = useMachineContext();

  // В идеале, список организаций может быть ключами assignments
  // Но если он фиксирован, можно оставить так:
  const organizations = ['Гранит', 'Эллада', 'Восток', 'Дорожники'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Назначения</Text>

      {organizations.map((org) => {
        const orgAssignments = assignments[org] || [];

        return (
          <View key={org} style={styles.orgBlock}>
            <Text style={styles.orgName}>{org}</Text>

            {/* Если нет записей, выводим "нет закреплений" */}
            {orgAssignments.length === 0 ? (
              <Text style={styles.noAssignments}>Нет закреплений</Text>
            ) : (
              <View style={styles.tableContainer}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={styles.colCategory}>Категория</DataTable.Title>
                    <DataTable.Title style={styles.colDriver}>Имя</DataTable.Title>
                    <DataTable.Title style={styles.colMachine}>Номер</DataTable.Title>
                  </DataTable.Header>

                  {orgAssignments.map((item, index) => {
                    const category = findCategoryForMachine(item.machine);
                    return (
                      <DataTable.Row key={index}>
                        <DataTable.Cell style={styles.colCategory}>
                          {category}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.colDriver}>
                          {item.driver}
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.colMachine}>
                          {item.machine}
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
                </DataTable>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Assignments;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  orgBlock: {
    marginBottom: 24,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  noAssignments: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginLeft: 8,
  },
  // стили колонок, если нужно задать ширину/выравнивание
  colCategory: {
    flex: 1.2,
  },
  colDriver: {
    flex: 1,
  },
  colMachine: {
    flex: 1,
  },
});