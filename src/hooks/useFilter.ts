// hooks/useFilter.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setFilter, resetFilter } from '@/store/slices/filterSlice';

export const useFilter = () => {
	const dispatch = useDispatch<AppDispatch>();
	const filter = useSelector((state: RootState) => state.advfilter);

	const updateFilter = (newFilter: Partial<RootState['advfilter']>) => {
		dispatch(setFilter(newFilter));
	};

	const clearFilter = () => {
		dispatch(resetFilter());
	};

	return { filter, updateFilter, clearFilter };
};
