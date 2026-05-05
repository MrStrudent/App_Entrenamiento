import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProgress } from '@/context/ProgressContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

type ProgressModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ProgressModal({ visible, onClose }: ProgressModalProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const { logs, photos, addLog, addPhoto, deleteLog, deletePhoto } = useProgress();

  const [activeTab, setActiveTab] = useState<'registro' | 'graficas' | 'fotos'>('registro');

  // Formularios
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

  const handleSaveLog = () => {
    if (!weight) return;
    addLog({
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
    });
    setWeight('');
    setChest('');
    setWaist('');
    setHips('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      addPhoto({
        date: new Date().toISOString(),
        uri: result.assets[0].uri,
      });
    }
  };

  const renderRegistro = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Nuevo Registro</Text>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Peso (kg)*</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder="0.0"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Cintura (cm)</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              keyboardType="numeric"
              value={waist}
              onChangeText={setWaist}
              placeholder="0.0"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Pecho (cm)</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              keyboardType="numeric"
              value={chest}
              onChangeText={setChest}
              placeholder="0.0"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Cadera (cm)</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              keyboardType="numeric"
              value={hips}
              onChangeText={setHips}
              placeholder="0.0"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.tint, opacity: weight ? 1 : 0.5 }]}
          onPress={handleSaveLog}
          disabled={!weight}
        >
          <Text style={styles.saveBtnText}>Guardar Registro</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Historial</Text>
      {logs.length === 0 ? (
        <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 16 }}>No hay registros aún.</Text>
      ) : (
        logs.map(log => {
          const date = new Date(log.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
          return (
            <View key={log.id} style={[styles.logItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View>
                <Text style={[styles.logDate, { color: theme.text }]}>{date}</Text>
                <Text style={[styles.logDetails, { color: theme.textMuted }]}>
                  {log.chest ? `P: ${log.chest} ` : ''}
                  {log.waist ? `C: ${log.waist} ` : ''}
                  {log.hips ? `Cd: ${log.hips}` : ''}
                </Text>
              </View>
              <View style={styles.logRight}>
                <Text style={[styles.logWeight, { color: theme.text }]}>{log.weight} kg</Text>
                <TouchableOpacity onPress={() => deleteLog(log.id)}>
                  <MaterialCommunityIcons name="delete" size={20} color={theme.danger} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );

  const renderGraficas = () => {
    if (logs.length < 2) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-line" size={48} color={theme.textMuted} />
          <Text style={{ color: theme.textMuted, marginTop: 16, textAlign: 'center' }}>
            Añade al menos 2 registros para ver las gráficas de evolución.
          </Text>
        </View>
      );
    }

    const sortedLogs = [...logs].reverse(); // cronológico para la gráfica
    const labels = sortedLogs.map(l => new Date(l.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }));
    
    // Mostrar últimos 6
    const maxData = 6;
    const chartLabels = labels.slice(-maxData);
    const weightData = sortedLogs.map(l => l.weight).slice(-maxData);

    const chartConfig = {
      backgroundGradientFrom: theme.background,
      backgroundGradientTo: theme.background,
      color: (opacity = 1) => colorScheme === 'dark' ? `rgba(74, 222, 128, ${opacity})` : `rgba(10, 126, 164, ${opacity})`,
      labelColor: (opacity = 1) => theme.textMuted,
      strokeWidth: 2,
      propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: theme.tint
      }
    };

    return (
      <ScrollView style={styles.tabContent}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Evolución de Peso (kg)</Text>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: weightData }]
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
      </ScrollView>
    );
  };

  const renderFotos = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={[styles.addPhotoBtn, { borderColor: theme.tint }]}
        onPress={handlePickImage}
      >
        <MaterialCommunityIcons name="camera-plus" size={28} color={theme.tint} />
        <Text style={[styles.addPhotoText, { color: theme.tint }]}>Añadir Foto</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.photoGrid}>
        {photos.map(photo => {
          const date = new Date(photo.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
          return (
            <View key={photo.id} style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoDate}>{date}</Text>
                <TouchableOpacity onPress={() => deletePhoto(photo.id)} style={styles.deletePhotoBtn}>
                  <MaterialCommunityIcons name="delete" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {photos.length === 0 && (
          <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 32, width: '100%' }}>
            Aún no hay fotos de progreso.
          </Text>
        )}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Progreso</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
          {(['registro', 'graficas', 'fotos'] as const).map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && { borderBottomColor: theme.tint, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === tab ? theme.tint : theme.textMuted, fontWeight: activeTab === tab ? 'bold' : 'normal' }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'registro' && renderRegistro()}
        {activeTab === 'graficas' && renderGraficas()}
        {activeTab === 'fotos' && renderFotos()}

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: 'bold' },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText: { fontSize: 16 },
  tabContent: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  
  // Registro
  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  inputRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  inputContainer: { flex: 1 },
  label: { fontSize: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  saveBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  logDate: { fontSize: 16, fontWeight: '600' },
  logDetails: { fontSize: 12, marginTop: 4 },
  logRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logWeight: { fontSize: 18, fontWeight: 'bold' },

  // Graficas
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },

  // Fotos
  addPhotoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', marginBottom: 24, gap: 8 },
  addPhotoText: { fontSize: 16, fontWeight: 'bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 40 },
  photoContainer: { width: '48%', aspectRatio: 3/4, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8 },
  photoDate: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  deletePhotoBtn: { padding: 4 },
});
