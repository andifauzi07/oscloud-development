import { useCallback } from 'react';

export function useSaveEdits<T>() {
	return useCallback(async (originalData: T[], updatedData: T[], keyField: keyof T, fieldsToCompare: (keyof T)[], updateFunction: (id: number, data: Partial<T>) => Promise<void>) => {
		try {
			const changedData = updatedData.filter((updatedItem) => {
				const originalItem = originalData.find((item) => item[keyField] === updatedItem[keyField]);

				if (!originalItem) return false;

				return fieldsToCompare.some((field) => updatedItem[field] !== originalItem[field]);
			});

			if (changedData.length === 0) {
				return;
			}

			await Promise.all(
				changedData.map(async (item) => {
					const id = item[keyField];
					if (!id) return;

					const updatePayload = fieldsToCompare.reduce((acc, field) => {
						acc[field] = item[field];
						return acc;
					}, {} as Partial<T>);

					await updateFunction(id as number, updatePayload);
				})
			);

			console.log('Success edit data');
			return true;
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, []);
}
