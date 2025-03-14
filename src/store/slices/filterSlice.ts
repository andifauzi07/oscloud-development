import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
	[key: string]: string | number | string[] | null | undefined;
}

export const initialState: FilterState = {};

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
