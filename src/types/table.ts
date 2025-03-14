import { ColumnDef, CellContext } from '@tanstack/react-table';

export type TableColumnType = 'text' | 'number' | 'boolean' | 'email' | 'date' | 'file' | 'image' | 'actions';

export interface BaseColumnSetting<T> {
	id?: string | number;
	accessorKey: keyof T & string; // Ensure it's a string key
	label?: string;
	header: string;
	type: TableColumnType;
	date_created?: string;
	status: 'shown' | 'hidden';
	order: number;
	cell?: (context: CellContext<T, unknown>) => React.ReactNode;
}

export interface TableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	loading?: boolean;
	enableRowDragAndDrop?: boolean;
	enableColumnDragAndDrop?: boolean;
	isEditable?: boolean;
	nonEditableColumns?: string[];
	onSave?: (data: T[]) => void;
	onRowDragEnd?: (result: { oldIndex: number; newIndex: number }) => void;
}
