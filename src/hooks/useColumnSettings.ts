import { useState, useCallback, useEffect } from 'react';
import { BaseColumnSetting } from '@/types/table';

interface UseColumnSettingsProps<T> {
  storageKey: string;
  defaultSettings: BaseColumnSetting<T>[];
  onInitialize?: (settings: BaseColumnSetting<T>[]) => BaseColumnSetting<T>[];
}

export function useColumnSettings<T>({ 
  storageKey, 
  defaultSettings,
  onInitialize 
}: UseColumnSettingsProps<T>) {
  const [settings, setSettings] = useState<BaseColumnSetting<T>[]>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsedSettings = JSON.parse(stored);
      return onInitialize ? onInitialize(parsedSettings) : parsedSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, storageKey]);

  const saveSettings = useCallback((newSettings: BaseColumnSetting<T>[] | ((prev: BaseColumnSetting<T>[]) => BaseColumnSetting<T>[])) => {
    setSettings(newSettings);
  }, []);

  const reorderColumns = useCallback((oldIndex: number, newIndex: number) => {
    setSettings(prev => {
      const newSettings = [...prev];
      const [removed] = newSettings.splice(oldIndex, 1);
      newSettings.splice(newIndex, 0, removed);
      return newSettings;
    });
  }, []);

  return {
    settings,
    saveSettings,
    reorderColumns
  };
}
