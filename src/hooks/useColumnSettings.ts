import { useState, useCallback, useEffect } from 'react';
import { BaseColumnSetting } from '@/types/table';

export function useColumnSettings<T>({ 
    storageKey, 
    defaultSettings 
}: { 
    storageKey: string;
    defaultSettings: BaseColumnSetting<T>[];
}) {
    const [settings, setSettings] = useState<BaseColumnSetting<T>[]>(() => {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : defaultSettings;
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
