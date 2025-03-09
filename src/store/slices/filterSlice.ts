import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
	status: string[];
	name: string;
	email: string;
	category: string;
	userId: string;
	from: string;
	to: string;
}

const initialState: FilterState = {
	status: [],
	name: '',
	email: '',
	category: '',
	userId: '',
	from: '',
	to: '',
};

const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
			return { ...state, ...action.payload };
		},
		resetFilter: () => initialState,
	},
});

export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
