//newpage
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

const NewPage = ({ route, navigation }) => {
  const { name: selectedOrg } = route.params;

  const {
    assignments,
    selectedItems,
    setSelectedItems,
    assignMachine,
    setAssignments,
  } = useMachineContext();

  const categories = [
    { name: 'КМУ', machines: ['938', '169', '671', '186'] },
    { name: 'МТЗ', machines: ['3990', '4227', '8826', '9199', '0279','4220','7751', '5393', '6245','4399','4159'] },
    { name: 'ЭП', machines: ['3581', '3003', '1434', '1435','4978', '7229', '8766'] },
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

  // Пример начальных закреплений (если нужны)
  const initialDriverAssignments = {
    'Курбан': '938',
    'Дима': '169',
    'Айдар': '671',
    'Фаниль': '186',
    'Альберт': 'МТЗ-1',
    'Фаркад': 'МТЗ-2',
    'Рамиль': '9199',
    'Ильмир': '8826',
    'Рамиль': 'ЭП-2', // дублируется имя
    'Паша': '0279',
    'АльбертН': '5393',
    'Ильгиз': 'ФП-2',
    'Хайдар': 'ФП-3',
    'Володя': 'HY-1',
    'Ильдар': 'HY-2',
    'Эдик': '3003',
    'Нафис': 'Кран-1',
    'Ильнур': 'Кран-2',
    'Нияз': 'Кран-3',
    'Леша': 'Sany',
  };

  const [drivers, setDrivers] = useState(Object.values(driversByCategory).flat());
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverAssignments, setDriverAssignments] = useState(initialDriverAssignments);

  useEffect(() => {
    // Инициализируем selectedItems для текущей организации, если не инициализировано
    if (!selectedItems[selectedOrg]) {
      setSelectedItems((prev) => ({
        ...prev,
        [selectedOrg]: { machines: [], drivers: [] },
      }));
    }
  }, [selectedOrg]);

  // Проверяем, не занят ли этот item в другой организации
  const isUnavailable = (item, type) => {
    return Object.entries(assignments).some(([orgName, orgAssignments]) =>
      orgName !== selectedOrg &&
      orgAssignments.some((assignment) => assignment[type.slice(0, -1)] === item)
    );
  };

  // Проверяем, выбраны ли ранее (в этой же организации)
  const isPreviouslySelected = (item, type) => {
    if (!selectedItems[selectedOrg]) return false;
    return selectedItems[selectedOrg][type]?.includes(item);
  };

  // Кнопка «Назначить»
  const handleAssign = () => {
    if (!selectedOrg || !selectedMachine || !selectedDriver) return;

    // Сохраняем выбор в selectedItems (чтобы показать «зелёным»)
    setSelectedItems((prev) => ({
      ...prev,
      [selectedOrg]: {
        machines: [
          ...new Set([...(prev[selectedOrg]?.machines || []), selectedMachine]),
        ],
        drivers: [
          ...new Set([...(prev[selectedOrg]?.drivers || []), selectedDriver]),
        ],
      },
    }));

    // Фиксируем в assignments
    assignMachine(selectedOrg, selectedMachine, selectedDriver);

    // (По желанию) сразу перейти на экран Assignments
    // navigation.navigate('Assignments', { selectedOrg });

    // Сбросить локальный выбор
    setSelectedMachine(null);
    setSelectedDriver(null);
  };

  // Отмена выбора
  const handleCancel = (item, type) => {
    Alert.alert(
      'Отмена выбора',
      `Хотите убрать «${item}» из списка этой организации?`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, убрать',
          style: 'destructive',
          onPress: () => {
            setSelectedItems((prev) => ({
              ...prev,
              [selectedOrg]: {
                ...prev[selectedOrg],
                [type]: prev[selectedOrg][type].filter(
                  (saved) => saved !== item
                ),
              },
            }));

            // Удаляем из assignments
            if (type === 'machines') {
              const driver = selectedItems[selectedOrg].drivers.find((driver) =>
                assignments[selectedOrg]?.some(
                  (assignment) => assignment.machine === item && assignment.driver === driver
                )
              );
              if (driver) {
                setAssignments((prev) => ({
                  ...prev,
                  [selectedOrg]: prev[selectedOrg].filter(
                    (assignment) => !(assignment.machine === item && assignment.driver === driver)
                  ),
                }));
                setSelectedItems((prev) => ({
                  ...prev,
                  [selectedOrg]: {
                    ...prev[selectedOrg],
                    drivers: prev[selectedOrg].drivers.filter((d) => d !== driver),
                  },
                }));
              }
            }
            if (type === 'drivers') {
              const machine = selectedItems[selectedOrg].machines.find((machine) =>
                assignments[selectedOrg]?.some(
                  (assignment) => assignment.driver === item && assignment.machine === machine
                )
              );
              if (machine) {
                setAssignments((prev) => ({
                  ...prev,
                  [selectedOrg]: prev[selectedOrg].filter(
                    (assignment) => !(assignment.driver === item && assignment.machine === machine)
                  ),
                }));
                setSelectedItems((prev) => ({
                  ...prev,
                  [selectedOrg]: {
                    ...prev[selectedOrg],
                    machines: prev[selectedOrg].machines.filter((m) => m !== machine),
                  },
                }));
              }
            }
          },
        },
      ]
    );
  };

  // Обработка нажатия на конкретную машину или водителя
  const handlePressItem = (item, type) => {
    const unavailable = isUnavailable(item, type);
    const previouslySel = isPreviouslySelected(item, type);

    // Если уже выбран — предлагаем «отменить»
    if (previouslySel) {
      handleCancel(item, type);
      return;
    }
    // Если занято в другой организации
    if (unavailable) {
      return;
    }

    // Выбираем/снимаем выбор
    if (type === 'machines') {
      setSelectedMachine((old) => (old === item ? null : item));
    } else {
      setSelectedDriver((old) => {
        const newDriver = old === item ? null : item;
        // Если водителю по умолчанию прописана машина
        if (newDriver && driverAssignments[newDriver]) {
          setSelectedMachine(driverAssignments[newDriver]);
        }
        return newDriver;
      });
    }
  };

  // Рендерим сетку (машины или водители)
  const renderGridItem = (data, selectedItem, type, icon) => {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => {
          const unavailable = isUnavailable(item, type);
          const prevSel = isPreviouslySelected(item, type);
          const isSelected = selectedItem === item;

          return (
            <View style={styles.gridItem}>
              <IconButton
                icon={icon}
                color={
                  unavailable
                    ? '#ccc'
                    : prevSel
                    ? '#28a745'    // уже закреплён
                    : isSelected
                    ? '#007BFF'   // только что выбран
                    : '#555'
                }
                size={20}
                onPress={() => handlePressItem(item, type)}
              />
              <Text
                style={[
                  styles.itemText,
                  unavailable && styles.unavailableText,
                  prevSel && styles.previouslySelectedText,
                  isSelected && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.scrollView}
        data={[1]} // заглушка, чтобы FlatList отрендерился
        keyExtractor={(item) => item.toString()}
        renderItem={() => (
          <View style={styles.content}>
            {/* Блок «Рабочие единицы» (машины) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Рабочие единицы</Text>
              {categories.map(({ name, machines }) => (
                <View key={name} style={styles.categoryBlock}>
                  <Text style={styles.categoryLabel}>{name}</Text>
                  {renderGridItem(machines, selectedMachine, 'machines', 'hammer')}
                </View>
              ))}
            </View>

            {/* Блок «Персонал» (водители) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Персонал</Text>
              {Object.entries(driversByCategory).map(([category, drivers]) => (
                <View key={category} style={styles.categoryBlock}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  {renderGridItem(drivers, selectedDriver, 'drivers', 'account')}
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Вместо footer делаем собственный "бар" внизу */}
      <View style={styles.bottomBar}>
        {/* Кнопка «Назначить» */}
        <Button
          mode="contained"
          disabled={!selectedMachine || !selectedDriver}
          onPress={handleAssign}
        >
          Назначить
        </Button>

        {/* Кнопка «Отправить» → переходим на Assignments */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Assignments')}
        >
          Отправить
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // чтобы блоки «Рабочие единицы» и «Персонал» были рядом
  },
  section: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
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
    marginVertical: 10,
    textAlign: 'center',
    color: '#007BFF',
  },
  gridContainer: {
    paddingBottom: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  unavailableText: {
    color: '#ccc',
  },
  previouslySelectedText: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },

  // ВАЖНО: стили для нашего нижнего бара
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',

    // Чтобы бар был «прижат» к низу экрана:
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    // если надо тень или бордер
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});