import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'http://localhost:3001/api';

export default function CarListPage() {
  const [cars, setCars] = useState([]);
  const [brandsMap, setBrandsMap] = useState({});
  const [modelsMap, setModelsMap] = useState({});
  const [generationsMap, setGenerationsMap] = useState({});
  const [modificationsMap, setModificationsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsRes, modelsRes, generationsRes, modificationsRes, carsRes] = await Promise.all([
          axios.get(`${API_BASE}/brands`),
          axios.get(`${API_BASE}/models`),
          axios.get(`${API_BASE}/generations`),
          axios.get(`${API_BASE}/modifications`),
          axios.get(`${API_BASE}/cars`),
        ]);

        setBrandsMap(Object.fromEntries(brandsRes.data.map(b => [b.brand_id, b.name])));
        setModelsMap(Object.fromEntries(modelsRes.data.map(m => [m.model_id, m.name])));
        setGenerationsMap(Object.fromEntries(generationsRes.data.map(g => [g.generation_id, g.name])));
        setModificationsMap(Object.fromEntries(modificationsRes.data.map(m => [m.modification_id, m.name])));
        setCars(carsRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('CarDetail', { id: item.id })}
    >
      <Text style={styles.itemIndex}>{index + 1}</Text>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{brandsMap[item.brand_id] || item.brand_id}</Text>
        <Text style={styles.itemText}>{modelsMap[item.model_id] || item.model_id}</Text>
        <Text style={styles.itemText}>{generationsMap[item.generation_id] || item.generation_id}</Text>
        <Text style={styles.itemText}>{modificationsMap[item.modification_id] || item.modification_id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Автопарк</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CarCreation')}>
        <Text style={styles.addButtonText}>Додати автомобіль</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0d6efd" style={{ marginTop: 30 }} />
      ) : cars.length === 0 ? (
        <Text style={styles.emptyText}>Автомобілі ще не додані.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#343a40',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0d6efd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIndex: {
    width: 24,
    fontWeight: 'bold',
    color: '#495057',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
    textAlign: 'center',
    color: '#343a40',
  },
});