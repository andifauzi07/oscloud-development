import { ColumnDef, CellContext } from '@tanstack/react-table';

export type TableColumnType = 'text' | 'number' | 'boolean' | 'email' | 'date' | 'file' | 'image' | 'actions' | 'dropdown' | 'url' | 'multiLineText' | 'dropdown';

export type CategoryDataField = '基本情報' | '単価' | '契約関連' | '講習会' | '面談結果' | 'SNS';

export interface BaseColumnSetting<T> {
	minWidth?: number;
	id?: string | number;
	accessorKey: keyof T & string; // Ensure it's a string key
	label?: string;
	header: string;
	category?: CategoryDataField;
	type: TableColumnType;
	date_created?: string;
	status: 'Active' | 'Hidden';
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
