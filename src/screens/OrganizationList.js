//OrganizationList
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useMachineContext } from '../context/MachineContext';

const OrganizationList = ({ navigation }) => {
  // Список организаций
  const organizations = ['Гранит', 'Эллада', 'Восток', 'Дорожники'];

  // Достаем из контекста назначения (assignments)
  const { assignments } = useMachineContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Организации</Text>

      {/* Кнопка «Отправить» — при нажатии переходим на Assignments */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Assignments')}
        style={styles.sendButton}
      >
        Отправить
      </Button>

      {organizations.map((org) => (
        <View key={org} style={styles.orgContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewPage', { name: org })}
            style={styles.orgButton}
          >
            {org}
          </Button>
          {assignments[org]?.length > 0 && (
            <View style={styles.assignmentList}>
              <Text style={styles.assignmentTitle}>Закреплено:</Text>
              {assignments[org].map(({ machine, driver }, index) => (
                <Text key={index} style={styles.assignmentText}>
                  {machine} → {driver}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default OrganizationList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orgContainer: {
    width: '100%',
    marginTop: 16,
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
  sendButton: {
    marginBottom: 16,
  },
});