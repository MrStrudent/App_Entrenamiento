import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProgressLog = {
  id: string;
  date: string; // ISO date
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
};

export type ProgressPhoto = {
  id: string;
  date: string;
  uri: string;
};

const LOGS_STORAGE_KEY = '@progress_logs';
const PHOTOS_STORAGE_KEY = '@progress_photos';

type ProgressContextType = {
  logs: ProgressLog[];
  photos: ProgressPhoto[];
  addLog: (log: Omit<ProgressLog, 'id'>) => void;
  deleteLog: (id: string) => void;
  addPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void;
  deletePhoto: (id: string) => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
        if (storedLogs) setLogs(JSON.parse(storedLogs));
        
        const storedPhotos = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
        if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
      } catch (e) {
        console.warn('Error loading progress data', e);
      }
    };
    loadData();
  }, []);

  const addLog = async (logData: Omit<ProgressLog, 'id'>) => {
    const newLog = { ...logData, id: Date.now().toString() };
    const newLogs = [newLog, ...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setLogs(newLogs);
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const deleteLog = async (id: string) => {
    const newLogs = logs.filter(l => l.id !== id);
    setLogs(newLogs);
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const addPhoto = async (photoData: Omit<ProgressPhoto, 'id'>) => {
    const newPhoto = { ...photoData, id: Date.now().toString() };
    const newPhotos = [newPhoto, ...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setPhotos(newPhotos);
    await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(newPhotos));
  };

  const deletePhoto = async (id: string) => {
    const newPhotos = photos.filter(p => p.id !== id);
    setPhotos(newPhotos);
    await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(newPhotos));
  };

  return (
    <ProgressContext.Provider value={{ logs, photos, addLog, deleteLog, addPhoto, deletePhoto }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
