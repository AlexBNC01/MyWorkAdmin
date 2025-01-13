// src/screens/OrganizationList.js

import React, { useState } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMachineContext } from '../context/MachineContext';

const OrganizationList = ({ navigation }) => {
  const organizations = ['Гранит', 'Эллада', 'Восток', 'Дорожники'];

  const {
    assignments,
    selectedDate,    // глобально храним подтверждённую дату (строка)
    setSelectedDate, // будем вызывать при нажатии "Подтвердить"
  } = useMachineContext();

  // Локальное состояние для календаря
  const [showCalendar, setShowCalendar] = useState(false);
  // Здесь храним «черновую» дату типа Date
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [tempPickedDate, setTempPickedDate] = useState(initialDate);

  // При выборе в календаре (не подтверждён)
  const onChangeDate = (event, date) => {
    if (event.type === 'set' && date) {
      // Пользователь покрутил календарь - запоминаем только локально
      setTempPickedDate(date);
    }
    // Если Cancel — ничего не делаем
  };

  // Кнопка «Подтвердить»
  const handleConfirmDate = () => {
    const y = tempPickedDate.getFullYear();
    const m = ('0' + (tempPickedDate.getMonth() + 1)).slice(-2);
    const d = ('0' + tempPickedDate.getDate()).slice(-2);
    const dateString = `${y}-${m}-${d}`;
    setSelectedDate(dateString);
    setShowCalendar(false);
  };

  // Показывать на кнопке/тексте
  const displayDate = selectedDate || 'Выберите дату';

  // Достаём назначения за подтверждённую дату
  const dayAssignments = selectedDate ? (assignments[selectedDate] || {}) : {};

  // Рендер элемента списка организаций
  const renderOrganization = ({ item: org }) => {
    const orgAssignments = dayAssignments[org] || [];

    return (
      <View style={styles.orgContainer}>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('NewPage', { name: org });
          }}
          style={styles.orgButton}
        >
          {org}
        </Button>

        {orgAssignments.length > 0 && (
          <View style={styles.assignmentList}>
            <Text style={styles.assignmentTitle}>Закреплено:</Text>
            {orgAssignments.map(({ machine, driver }, index) => (
              <Text key={index} style={styles.assignmentText}>
                {machine} → {driver}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={organizations}
        keyExtractor={(item) => item}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Организации</Text>

            {/* Кнопка, открывающая календарь */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.datePickerText}>{displayDate}</Text>
            </TouchableOpacity>

            {/* Если showCalendar = true, отображаем <DateTimePicker> + «Подтвердить» */}
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

            {/* Если дата не подтверждена - выводим подсказку */}
            {!selectedDate && (
              <Text style={styles.noDateText}>
                Пожалуйста, выберите и подтвердите дату
              </Text>
            )}
          </>
        }
        renderItem={renderOrganization}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default OrganizationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 80, // Чтобы контент не скрывался под нижней панелью
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  calendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    marginTop: 8,
    width: '60%',
  },
  noDateText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  orgContainer: {
    marginBottom: 16,
  },
  orgButton: {
    marginBottom: 8,
  },
  assignmentList: {
    paddingLeft: 16,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  assignmentText: {
    fontSize: 12,
    color: '#555',
  },
});