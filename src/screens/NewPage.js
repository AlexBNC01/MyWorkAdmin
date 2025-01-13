// src/screens/NewPage.js

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

const NewPage = ({ route }) => {
  const { name: selectedOrg } = route.params;

  const {
    selectedDate,
    assignments,
    assignMachine,
    // ↓↓↓ Нужно будет добавить метод для "удаления" назначений по конкретной машине/водителю
    // Если у вас нет такого метода — придётся реализовать что-то подобное в контексте.
    // Назовём его условно removeAssignmentsForItem.
    removeAssignmentsForItem, // <-- убедитесь, что этот метод есть в MachineContext
  } = useMachineContext();

  // Локальное состояние выбора
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Справочные категории
  const categories = [
    { name: 'КМУ', machines: ['938', '169', '671', '186'] },
    { name: 'МТЗ', machines: ['3990', '4227', '8826', '9199', '0279', '4220', '7751', '5393', '6245', '4399', '4159'] },
    { name: 'ЭП', machines: ['3581', '3003', '1434', '1435', '4978', '7229', '8766'] },
    { name: 'ФП', machines: ['0366'] },
    { name: 'HY', machines: ['4977'] },
    { name: 'Кран', machines: ['Sany'] },
  ];

  const driversByCategory = {
    'КМУ': ['Курбан', 'Дима', 'Айдар', 'Фаниль'],
    'МТЗ': ['Альберт', 'Фаркад', 'Рамиль', 'Ильдар', 'Ильмир', 'Рамиль', 'Паша', 'АльбертН', 'Хайдар', 'Володя', 'Наемный'],
    'ЭП': ['Ильгиз', 'Каниф', 'Эдик', 'Нафис', 'Ильнур', 'Нияз', 'Айнур', 'Фаниль'],
    'ФП': ['Умид', 'Фаниль'],
    'HY': ['Гера'],
    'Кран': ['Леша'],
  };

  // Карта сопоставления водителей и машин (для автоподстановки)
  const driverToMachineMap = {
    'Курбан': '938',
    'Дима': '169',
    'Айдар': '671',
    'Фаниль': '186',
    'Альберт': '3990',
    'Фаркад': '4227',
    'Рамиль': '8826',
    'Ильдар': '9199',
    'Ильмир': '0279',
    'Паша': '4220',
    'АльбертН': '7751',
    'Хайдар': '5393',
    'Володя': '6245',
    'Наемный': '4399',
    'Ильгиз': '4159',
    'Каниф': '3581',
    'Эдик': '3003',
    'Нафис': '1434',
    'Ильнур': '1435',
    'Нияз': '4978',
    'Айнур': '7229',
    'Эрик': '8766',
    'Умид': '0366',
    'Гера': '4977',
    'Леша': 'Sany',
  };

  // Достаем назначения для текущей даты и организации
  const orgAssignments = assignments[selectedDate]?.[selectedOrg] || [];

  // 1) Функция проверки, что элемент (машина/водитель) назначен в ЭТУ организацию
  // NEW
  const isAssignedToThisOrg = (item, type) => {
    if (!selectedDate) return false;
    // Смотрим в orgAssignments
    if (type === 'machines') {
      return orgAssignments.some((asmt) => asmt.machine === item);
    } else {
      return orgAssignments.some((asmt) => asmt.driver === item);
    }
  };

  // 2) Функция для проверки занятости в ДРУГИХ организациях
  // (как у вас было, но теперь явно указываем, что org !== selectedOrg)
  const isUnavailable = (item, type) => {
    if (!selectedDate) return false; // без даты ничего не блокируем
    const dayData = assignments[selectedDate] || {};
    return Object.entries(dayData).some(([org, arr]) =>
      // если org !== текущая организация — значит занято в другом месте
      org !== selectedOrg &&
      arr.some((asmt) => (type === 'machines' ? asmt.machine === item : asmt.driver === item))
    );
  };

  // 3) Логика нажатия на элемент
  //    Если элемент уже назначен в текущую организацию -> предлагаем удалить.
  //    Иначе — работаем с локальным выбором (старый код).
  // NEW / CHANGE
  const handlePressItem = (item, type) => {
    if (!selectedDate) {
      Alert.alert('Ошибка', 'Сначала выберите дату на предыдущем экране!');
      return;
    }

    // Проверим, назначен ли этот item (машина/водитель) именно в эту организацию
    if (isAssignedToThisOrg(item, type)) {
      // Спрашиваем, действительно ли удалить
      Alert.alert(
        'Отмена назначения',
        `Убрать «${item}» из назначений?`,
        [
          { text: 'Нет', style: 'cancel' },
          {
            text: 'Да',
            onPress: () => {
              // Удаляем все назначения, связанные с этим item (в рамках текущей org)
              removeAssignmentsForItem(selectedOrg, item, type, selectedDate);
            },
          },
        ]
      );
    } else {
      // Иначе — это логика выбора (как у вас и было)
      if (type === 'machines') {
        // Если техника уже выбрана, снимаем выбор
        setSelectedMachine((old) => (old === item ? null : item));
      } else {
        // Если водитель уже выбран, снимаем выбор
        setSelectedDriver((old) => (old === item ? null : item));
      }
    }
  };

  // Автовыбор машины при выборе водителя
  useEffect(() => {
    if (selectedDriver) {
      const autoSelectedMachine = driverToMachineMap[selectedDriver];
      if (autoSelectedMachine) {
        setSelectedMachine(autoSelectedMachine);
      } else {
        setSelectedMachine(null);
      }
    } else {
      setSelectedMachine(null);
    }
  }, [selectedDriver]);

  // Кнопка "Назначить"
  const handleAssign = () => {
    if (!selectedDate) {
      Alert.alert('Ошибка', 'Сначала выберите дату на предыдущем экране!');
      return;
    }
    if (!selectedMachine || !selectedDriver) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите машину и водителя!');
      return;
    }

    assignMachine(selectedOrg, selectedMachine, selectedDriver, selectedDate);
    setSelectedMachine(null);
    setSelectedDriver(null);

    Alert.alert('Успех', 'Назначение успешно добавлено!');
  };

  // Рендер элемента машины
  const renderMachine = (machine) => {
    const unavailable = isUnavailable(machine, 'machines');   // занята в другой org
    const assignedHere = isAssignedToThisOrg(machine, 'machines'); // назначена именно в эту org
    const isSelected = selectedMachine === machine && !assignedHere;

    // Приоритет цвета:
    // 1) если unavailable -> серый
    // 2) если assignedHere -> зелёный (т.к. уже назначена в эту орг)
    // 3) если isSelected -> зелёный (т.к. локально выбираем для назначения)
    // 4) иначе -> обычный
    let iconColor = '#555';
    if (unavailable) {
      iconColor = '#ccc';
    } else if (assignedHere || isSelected) {
      iconColor = '#28a745'; // зелёный
    }

    // Аналогично стили текста
    let textStyles = [styles.itemText];
    if (unavailable) {
      textStyles.push(styles.unavailableText);
    } else if (assignedHere || isSelected) {
      textStyles.push(styles.selectedText); // зелёный жирный
    }

    return (
      <View key={machine} style={styles.gridItem}>
        <IconButton
          icon="truck"
          color={iconColor}
          size={20}
          onPress={() => {
            if (!unavailable) {
              handlePressItem(machine, 'machines');
            }
          }}
        />
        <Text style={textStyles}>{machine}</Text>
      </View>
    );
  };

  // Рендер элемента водителя
  const renderDriver = (driver) => {
    const unavailable = isUnavailable(driver, 'drivers');
    const assignedHere = isAssignedToThisOrg(driver, 'drivers');
    const isSelected = selectedDriver === driver && !assignedHere;

    let iconColor = '#555';
    if (unavailable) {
      iconColor = '#ccc';
    } else if (assignedHere || isSelected) {
      iconColor = '#28a745';
    }

    let textStyles = [styles.itemText];
    if (unavailable) {
      textStyles.push(styles.unavailableText);
    } else if (assignedHere || isSelected) {
      textStyles.push(styles.selectedText);
    }

    return (
      <View key={driver} style={styles.gridItem}>
        <IconButton
          icon="account"
          color={iconColor}
          size={20}
          onPress={() => {
            if (!unavailable) {
              handlePressItem(driver, 'drivers');
            }
          }}
        />
        <Text style={textStyles}>{driver}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerInfo}>
          Дата: {selectedDate || 'не выбрана'} {'\n'}
          Организация: {selectedOrg}
        </Text>

        <View style={styles.columnsContainer}>
          {/* Колонка для Техники */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Техника</Text>
            {categories.map((category) => (
              <View key={category.name} style={styles.categoryBlock}>
                <Text style={styles.categoryLabel}>{category.name}</Text>
                <View style={styles.itemsContainer}>
                  {category.machines.map((machine) => renderMachine(machine))}
                </View>
              </View>
            ))}
          </View>

          {/* Колонка для Водителей */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Водители</Text>
            {Object.entries(driversByCategory).map(([categoryName, drivers]) => (
              <View key={categoryName} style={styles.categoryBlock}>
                <Text style={styles.categoryLabel}>{categoryName}</Text>
                <View style={styles.itemsContainer}>
                  {drivers.map((driver) => renderDriver(driver))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Нижняя панель с кнопками */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleAssign}
          disabled={!selectedMachine || !selectedDriver}
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
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100, // Чтобы контент не скрывался под нижней панелью
  },
  headerInfo: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
    fontSize: 16,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007BFF',
  },
  categoryBlock: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#007BFF',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Половина ширины колонки с небольшим отступом
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  unavailableText: {
    color: '#ccc',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#28a745', // Подсветка зелёным для выбранных/назначенных элементов
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',

    // если надо тень или бордер
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});