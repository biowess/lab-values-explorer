import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgeUnit } from '../types';

interface Preferences {
  defaultAgeUnit: AgeUnit;
  defaultSex: 'all' | 'male' | 'female';
}

interface LocalDataContextType {
  savedLabIds: string[];
  preferences: Preferences;
  toggleSavedLab: (id: string) => void;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  clearLocalData: () => void;
}

const defaultPreferences: Preferences = {
  defaultAgeUnit: 'years',
  defaultSex: 'all',
};

const LocalDataContext = createContext<LocalDataContextType | undefined>(undefined);

export function LocalDataProvider({ children }: { children: ReactNode }) {
  const [savedLabIds, setSavedLabIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('lve_saved_labs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem('lve_preferences');
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lve_saved_labs', JSON.stringify(savedLabIds));
    } catch (e) {
      console.error('Failed to save labs to localStorage', e);
    }
  }, [savedLabIds]);

  useEffect(() => {
    try {
      localStorage.setItem('lve_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  }, [preferences]);

  const toggleSavedLab = (id: string) => {
    setSavedLabIds((prev) => 
      prev.includes(id) ? prev.filter((lId) => lId !== id) : [...prev, id]
    );
  };

  const updatePreferences = (prefs: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const clearLocalData = () => {
    setSavedLabIds([]);
    setPreferences(defaultPreferences);
    try {
      localStorage.removeItem('lve_saved_labs');
      localStorage.removeItem('lve_preferences');
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  return (
    <LocalDataContext.Provider value={{ savedLabIds, preferences, toggleSavedLab, updatePreferences, clearLocalData }}>
      {children}
    </LocalDataContext.Provider>
  );
}

export const useLocalData = () => {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error('useLocalData must be used within LocalDataProvider');
  }
  return context;
};
