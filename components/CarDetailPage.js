import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  getBrands,
  getModelsByBrand,
  getGenerations,
  getModifications,
  getValues,
  saveCar,
  deleteCar,
} from '../services/CarServices';
import { API_BASE } from '../services/CarServices';

export default function CarDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [car, setCar] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [generationId, setGenerationId] = useState('');
  const [modificationId, setModificationId] = useState('');

  useEffect(() => {
    getBrands()
      .then(res => setBrands(res.data))
      .catch(err => Alert.alert('Помилка', 'Не вдалося завантажити бренди'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function loadCar() {
      try {
        const res = await fetch(`${API_BASE}/cars/${id}`);
        const carData = await res.json();
        setCar(carData);
        setBrandId(String(carData.brand_id));
        setModelId(String(carData.model_id));
        setGenerationId(String(carData.generation_id));
        setModificationId(String(carData.modification_id));
      } catch (err) {
        console.error(err);
        Alert.alert('Помилка', 'Не вдалося завантажити дані про авто');
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  useEffect(() => {
    if (car) {
      const loadAll = async () => {
        try {
          const modelsRes = await getModelsByBrand(car.brand_id);
          setModels(modelsRes.data);

          const generationsRes = await getGenerations(car.brand_id, car.model_id);
          setGenerations(generationsRes.data);

          const modsRes = await getModifications(car.brand_id, car.model_id, car.generation_id);
          setModifications(modsRes.data);
        } catch (error) {
          console.error('Ошибка при инициализации зависимостей', error);
        }
      };
      loadAll();
    }
  }, [car]);

  useEffect(() => {
    if (car && brandId !== String(car.brand_id)) {
      setModelId('');
      setModels([]);
      setGenerationId('');
      setGenerations([]);
      setModificationId('');
      setModifications([]);
      setValues([]);
    }
    if (brandId) {
      getModelsByBrand(Number(brandId))
        .then(res => setModels(res.data))
        .catch(err => console.error(err));
    }
  }, [brandId, car]);

useEffect(() => {
    if (car && modelId !== String(car.model_id)) {
      setGenerationId('');
      setGenerations([]);
      setModificationId('');
      setModifications([]);
      setValues([]);
    }
    if (modelId) {
      getGenerations(Number(brandId), Number(modelId))
        .then(res => setGenerations(res.data))
        .catch(err => console.error(err));
    }
  }, [modelId, car]);

useEffect(() => {
    if (car && generationId !== String(car.generation_id)) {
      setModificationId('');
      setModifications([]);
      setValues([]);
    }
    if (generationId) {
      getModifications(Number(brandId), Number(modelId), Number(generationId))
        .then(res => setModifications(res.data))
        .catch(err => console.error(err));
    }
  }, [generationId, car]);

  useEffect(() => {
    if (brandId && modelId && generationId && modificationId) {
      getValues(Number(brandId), Number(modelId), Number(generationId), Number(modificationId))
        .then(res => setValues(res.data))
        .catch(err => console.error(err));
    } else {
      setValues([]);
    }
  }, [brandId, modelId, generationId, modificationId]);

const handleSave = async () => {
    if (!brandId || !modelId || !generationId || !modificationId) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля перед збереженням');
      return;
    }
    try {
      await saveCar(Number(brandId), Number(modelId), Number(generationId), Number(modificationId), id);
      Alert.alert('Успіх', 'Дані збережено', [
        { text: 'OK', onPress: () => navigation.navigate('CarList') }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Помилка', 'Помилка при збереженні');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Підтвердження',
      'Ви впевнені, що хочете видалити цей автомобіль?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', style: 'destructive', onPress: async () => {
          try {
            await deleteCar(id);
            Alert.alert('Успіх', 'Автомобіль видалено', [
              { text: 'OK', onPress: () => navigation.navigate('CarList') }
            ]);
          } catch (err) {
            console.error(err);
            Alert.alert('Помилка', 'Помилка при видаленні');
          }
        }}
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0d6efd" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Редагування автомобіля #{id}</Text>

      <Text style={styles.label}>Бренд:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={brandId}
          onValueChange={value => setBrandId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Оберіть бренд" value="" />
          {brands.map(b => (
            <Picker.Item key={b.brand_id} label={b.name} value={String(b.brand_id)} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Модель:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={modelId}
          onValueChange={value => setModelId(value)}
          enabled={!!brandId}
          style={styles.picker}
        >
          <Picker.Item label="Оберіть модель" value="" />
          {models.map(m => (
            <Picker.Item key={m.model_id} label={m.name} value={String(m.model_id)} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Покоління:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={generationId}
          onValueChange={value => setGenerationId(value)}
          enabled={!!modelId}
          style={styles.picker}
        >
          <Picker.Item label="Оберіть покоління" value="" />
          {generations.map(g => (
            <Picker.Item key={g.generation_id} label={g.name} value={String(g.generation_id)} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Модифікація:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={modificationId}
          onValueChange={value => setModificationId(value)}
          enabled={!!generationId}
          style={styles.picker}
        >
          <Picker.Item label="Оберіть модифікацію" value="" />
          {modifications.map(m => (
            <Picker.Item key={m.modification_id} label={m.name} value={String(m.modification_id)} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subTitle}>Характеристики:</Text>
      {values.length > 0 ? (
        values.map((v, index) => (
          <Text key={index} style={styles.valueItem}>• {v.name}: {v.value}</Text>
        ))
      ) : (
        <Text style={styles.infoText}>
          {brandId && modelId && generationId && modificationId
            ? 'Характеристики не знайдені'
            : 'Оберіть усі параметри'}
        </Text>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            { opacity: brandId && modelId && generationId && modificationId ? 1 : 0.5 }
          ]}
          onPress={handleSave}
          disabled={!brandId || !modelId || !generationId || !modificationId}
        >
          <Text style={styles.buttonText}>Зберегти</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Видалити</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fdfdfd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 6,
    color: '#444',
  },
  pickerContainer: {
    height: '100',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    fontSize: 10,
    bottom: 70,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  valueItem: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});