import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setFilter, resetFilter, initialState } from '@/store/slices/filterSlice';
import useDebounce from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

const convertToNumberIfPossible = (value: any) => {
	if (typeof value === 'string' && !isNaN(Number(value))) {
		return Number(value);
	}
	return value;
};

export const useFilter = () => {
	const dispatch = useDispatch<AppDispatch>();
	const filter = useSelector((state: RootState) => state.advfilter);

	const [localFilter, setLocalFilter] = useState(filter);

	const debouncedFilter = useDebounce(localFilter, 100);

	useEffect(() => {
		dispatch(setFilter(debouncedFilter));
	}, [debouncedFilter, dispatch]);

	const updateFilter = (newFilter: Partial<RootState['advfilter']>) => {
		const convertedFilter = Object.entries(newFilter).reduce(
			(acc, [key, value]) => {
				acc[key] = convertToNumberIfPossible(value);
				return acc;
			},
			{} as Partial<RootState['advfilter']>
		);

		setLocalFilter((prev) => ({ ...prev, ...convertedFilter }));
	};

	const clearFilter = () => {
		setLocalFilter(initialState);
		dispatch(resetFilter());
	};

	return { filter, updateFilter, clearFilter };
};
