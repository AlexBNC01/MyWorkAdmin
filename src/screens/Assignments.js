// src/screens/Assignments.js

import React, { useState } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Platform,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, DataTable, Button } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

// Справочник для категорий (если нужно определить категорию по машине)
const machineCategories = {
  'КМУ': ['938','169','671','186'],
  'МТЗ': ['3990','4227','8826','9199','0279','4220','7751','5393','6245','4399','4159'],
  'ЭП':  ['3581','3003','1434','1435','4978','7229','8766'],
  'ФП':  ['0366'],
  'HY':  ['4977'],
  'Кран': ['Sany'],
};

// Функция нахождения категории по номеру машины:
function findCategoryForMachine(machine) {
  for (const cat in machineCategories) {
    if (machineCategories[cat].includes(machine)) return cat;
  }
  return '—';
}

const Assignments = () => {
  const { assignments } = useMachineContext();

  // Локальная дата для экрана Assignments
  const [assignmentsDate, setAssignmentsDate] = useState('');
  
  // Локальное хранение даты из календаря (Date)
  const [tempPickedDate, setTempPickedDate] = useState(new Date());
  // Флаг показа календаря
  const [showCalendar, setShowCalendar] = useState(false);

  // Обработчик выбора даты в календаре
  const onChangeDate = (event, date) => {
    if (event.type === 'set' && date) {
      // Пользователь выбрал дату (на iOS может оставаться открытым «спиннер»)
      setTempPickedDate(date);
    }
    // Если Cancel — ничего не меняем
  };

  // «Подтвердить» — формируем строку даты и сохраняем в assignmentsDate
  const handleConfirmDate = () => {
    const y = tempPickedDate.getFullYear();
    const m = ('0' + (tempPickedDate.getMonth() + 1)).slice(-2);
    const d = ('0' + tempPickedDate.getDate()).slice(-2);
    const dateString = `${y}-${m}-${d}`;

    setAssignmentsDate(dateString);
    setShowCalendar(false);
  };

  // Берём назначенные данные за текущую дату (если выбрана)
  const dayData = assignmentsDate ? (assignments[assignmentsDate] || {}) : {};
  // Предположим, у нас фиксированный список организаций:
  const organizations = ['Гранит', 'Эллада', 'Восток', 'Дорожники'];

  // Функция рендера одного элемента (одной организации) в списке FlatList
  const renderOrganization = ({ item: org }) => {
    const orgAssignments = dayData[org] || [];

    return (
      <View style={styles.orgContainer}>
        <Text style={styles.orgName}>{org}</Text>

        {orgAssignments.length > 0 ? (
          <View style={styles.assignmentList}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.colCategory}>
                  <Text style={styles.headerText}>Категория</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.colDriver}>
                  <Text style={styles.headerText}>Водитель</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.colMachine}>
                  <Text style={styles.headerText}>Номер</Text>
                </DataTable.Title>
              </DataTable.Header>

              {orgAssignments.map((item, i) => {
                const cat = findCategoryForMachine(item.machine);
                return (
                  <DataTable.Row key={i} style={styles.tableRow}>
                    <DataTable.Cell style={styles.colCategory}>{cat}</DataTable.Cell>
                    <DataTable.Cell style={styles.colDriver}>{item.driver}</DataTable.Cell>
                    <DataTable.Cell style={styles.colMachine}>{item.machine}</DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>
          </View>
        ) : (
          <Text style={styles.noAssignments}>Нет закреплений</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={organizations}
        keyExtractor={(item) => item}
        // Заголовок списка
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Таблица назначений</Text>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.datePickerText}>
                {assignmentsDate || 'Выберите дату'}
              </Text>
            </TouchableOpacity>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <DateTimePicker
                  value={tempPickedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={onChangeDate}
                />
                <Button
                  mode="contained"
                  style={styles.confirmButton}
                  onPress={handleConfirmDate}
                >
                  Подтвердить
                </Button>
              </View>
            )}

            {!assignmentsDate && (
              <Text style={styles.noDateText}>
                Пожалуйста, выберите и подтвердите дату для просмотра
              </Text>
            )}
          </>
        }
        renderItem={renderOrganization}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default Assignments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 80, // Чтобы контент не скрывался под нижней панелью (если есть)
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
    marginTop: 20, // чтобы заголовок располагался ниже системных индикаторов
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  datePickerText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '500',
  },
  calendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    marginTop: 8,
    width: '60%',
    paddingVertical: 6,
  },
  noDateText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  orgContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    // тень (Android + iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#007BFF',
  },
  assignmentList: {
    // убираем лишние отступы для компактности
  },
  noAssignments: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  // Здесь столбцы
  colCategory: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colDriver: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colMachine: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Убираем фикс. высоту
  tableRow: {
    // minHeight: 30, // если нужно задать минимальную высоту, можно добавить, иначе оставляем пустым
  },
  headerText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 13,
  },
});