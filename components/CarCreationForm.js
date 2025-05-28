import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import {
  getBrands,
  getModelsByBrand,
  getGenerations,
  getModifications,
  getValues,
  createCar,
} from '../services/CarServices';

export default function CarCreationForm() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [values, setValues] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [generationId, setGenerationId] = useState('');
  const [modificationId, setModificationId] = useState('');
  const [loading, setLoading] = useState(true);
  const isSaveEnabled = brandId && modelId && generationId && modificationId;

  const navigation = useNavigation();

  useEffect(() => {
    getBrands()
      .then(res => setBrands(res.data))
      .catch(err => Alert.alert('Помилка', 'Не вдалося завантажити бренди'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setModelId('');
    setModels([]);
    setGenerationId('');
    setGenerations([]);
    setModificationId('');
    setModifications([]);
    setValues([]);
    if (brandId) {
      getModelsByBrand(Number(brandId))
        .then(res => setModels(res.data))
        .catch(err => console.error(err));
    }
  }, [brandId]);

  useEffect(() => {
    setGenerationId('');
    setGenerations([]);
    setModificationId('');
    setModifications([]);
    setValues([]);
    if (brandId && modelId) {
      getGenerations(Number(brandId), Number(modelId))
        .then(res => setGenerations(res.data))
        .catch(err => console.error(err));
    }
  }, [modelId, brandId]);

  useEffect(() => {
    setModificationId('');
    setModifications([]);
    setValues([]);
    if (brandId && modelId && generationId) {
      getModifications(
        Number(brandId),
        Number(modelId),
        Number(generationId)
      )
        .then(res => setModifications(res.data))
        .catch(err => console.error(err));
    }
  }, [generationId, modelId, brandId]);

  useEffect(() => {
    if (
      brandId &&
      modelId &&
      generationId &&
      modificationId
    ) {
      getValues(
        Number(brandId),
        Number(modelId),
        Number(generationId),
        Number(modificationId)
      )
        .then(res => setValues(res.data))
        .catch(err => console.error(err));
    } else {
      setValues([]);
    }
  }, [brandId, modelId, generationId, modificationId]);

  const handleSubmit = async () => {
    if (!isSaveEnabled) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля перед створенням');
      return;
    }
    try {
      const res = await createCar({
        brand_id: Number(brandId),
        model_id: Number(modelId),
        generation_id: Number(generationId),
        modification_id: Number(modificationId),
      });
      Alert.alert('Успіх', `Автомобіль створено! ID: ${res.data.id}`, [
        { text: 'OK', onPress: () => navigation.navigate('CarList') }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Помилка', err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0d6efd" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Створення автомобіля</Text>

      <Text style={styles.label}>Марка:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={brandId}
          onValueChange={value => setBrandId(value)}
          style={styles.picker}
        >
          <Picker.Item label="Оберіть марку" value="" />
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
        values.map((v, i) => (
          <Text key={i} style={styles.valueItem}>• {v.name}: {v.value}</Text>
        ))
      ) : (
        <Text style={styles.infoText}>
          {modificationId ? 'Характеристики не знайдені' : 'Оберіть усі параметри'}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isSaveEnabled ? '#0d6efd' : '#888', opacity: isSaveEnabled ? 1 : 0.5 }
        ]}
        onPress={handleSubmit}
        disabled={!isSaveEnabled}
      >
        <Text style={styles.buttonText}>Створити автомобіль</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    bottom: 20,
    paddingTop: 80,
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
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 6,
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
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});