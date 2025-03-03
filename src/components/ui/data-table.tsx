import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useState, useEffect, useCallback } from 'react';
import { Input } from './input';
import { Button } from './button';
import Loading from '../Loading';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading?: boolean;
	enableRowDragAndDrop?: boolean;
	enableColumnDragAndDrop?: boolean;
	isEditable?: boolean;
	nonEditableColumns?: string[];
	onSave?: (data: TData[]) => void;
	rowDragProps?: {
		onDragStart: (e: React.DragEvent<HTMLDivElement>, key: string) => void;
		onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
		onDrop: (e: React.DragEvent<HTMLDivElement>, dropKey: string) => void;
		draggedKey: string | null;
	};
}

interface EditableCellProps<TData> {
	value: any;
	row: {
		index: number;
		original: TData;
	};
	column: {
		id: string;
	};
	updateData: (index: number, id: string, value: any) => void;
	isEditable: boolean;
}

const EditableCell = <TData,>({ value: initialValue, row: { index, original }, column: { id }, updateData, isEditable }: EditableCellProps<TData>) => {
	const [value, setValue] = useState<string>(initialValue?.toString() || '');

	useEffect(() => {
		setValue(initialValue?.toString() || '');
	}, [initialValue]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);
			updateData(index, id, newValue);
		},
		[index, id, updateData]
	);

	if (!isEditable) {
		return <span className="text-xs whitespace-nowrap">{value}</span>;
	}

	return (
		<Input
			enableEmoji={false}
			value={value}
			onChange={handleChange}
			className="h-8 p-0 text-xs bg-transparent border-0 whitespace-nowrap focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		/>
	);
};

export function DataTable<TData, TValue>({ columns, data, loading = false, enableRowDragAndDrop = false, enableColumnDragAndDrop = false, isEditable = false, nonEditableColumns = [], onSave, rowDragProps }: DataTableProps<TData, TValue>) {
	const [tableData, setTableData] = useState<TData[]>(data);
	const [tableColumns, setTableColumns] = useState(columns);

	// Update tableData when data prop changes
	useEffect(() => {
		setTableData(data);
	}, [data]);

	// Update columns when isEditable, columns or nonEditableColumns change
	useEffect(() => {
		const editableColumns = columns.map((col) => {
			const shouldEdit =
				isEditable &&
				!nonEditableColumns.some((pattern) => {
					if (pattern.endsWith('*')) {
						const prefix = pattern.slice(0, -1);
						return col.id?.startsWith(prefix) || col.id?.startsWith(prefix);
					}
					return col.id === pattern || col.id === pattern;
				});

			if (shouldEdit && col.cell) {
				return {
					...col,
					cell: (props: CellContext<TData, TValue>) => {
						return (
							<EditableCell
								value={props.getValue()}
								row={{ index: props.row.index, original: props.row.original }}
								column={{ id: props.column.id || '' }}
								updateData={(index: number, id: string, value: any) => {
									setTableData((prevData) => {
										return prevData.map((row, rowIndex) => {
											if (rowIndex === index) {
												return { ...row, [id]: value };
											}
											return row;
										});
									});
								}}
								isEditable={isEditable}
							/>
						);
					},
				};
			} else {
				return col;
			}
		});
		setTableColumns(editableColumns);
	}, [isEditable, columns, nonEditableColumns]);

	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

	const table = useReactTable({
		data: tableData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Handle row drag-and-drop
	const handleRowDragEnd = (event: any) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setTableData((prev) => {
			const oldIndex = prev.findIndex((item: any) => item.companyId === active.id);
			const newIndex = prev.findIndex((item: any) => item.companyId === over.id);
			return arrayMove(prev, oldIndex, newIndex);
		});
	};

	// Handle column drag-and-drop
	const handleColumnDragEnd = (event: any) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setTableColumns((prev) => {
			const oldIndex = prev.findIndex((col) => col.id === active.id);
			const newIndex = prev.findIndex((col) => col.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return prev;
			return arrayMove(prev, oldIndex, newIndex);
		});
	};

	// Sortable Row Component
	const SortableRow = ({ row }: { row: any }) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.original.companyId });
		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? 0.5 : 1,
		};

		return (
			<TableRow
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="border-t">
				{row.getVisibleCells().map((cell: any) => (
					<TableCell
						key={cell.id}
						className="">
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
			</TableRow>
		);
	};

	// Sortable Column Headers
	const SortableHeader = ({ header }: { header: any }) => {
		const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: header.column.id });

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
		};

		return (
			<TableHead
				key={header.id}
				ref={setNodeRef}
				style={enableColumnDragAndDrop ? style : undefined}
				{...(enableColumnDragAndDrop ? attributes : {})}
				{...(enableColumnDragAndDrop ? listeners : {})}
				className="text-left font-bold text-[#0a0a30] cursor-pointer">
				{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
			</TableHead>
		);
	};

	return (
		<div className="flex flex-col w-full">
			{isEditable && onSave && (
				<div className="flex justify-end flex-none w-full bg-white border-b">
					<Button
						onClick={() => onSave(tableData)}
						className="text-black bg-transparent border-l md:w-20 link border-l-none min-h-10">
						SAVE
					</Button>
				</div>
			)}
			<div className="w-full bg-white border-t border-b border-r">
				{enableRowDragAndDrop || enableColumnDragAndDrop ? (
					<DndContext
						sensors={sensors}
						onDragEnd={(event) => {
							if (enableColumnDragAndDrop) {
								handleColumnDragEnd(event);
							} else if (enableRowDragAndDrop) {
								handleRowDragEnd(event);
							}
						}}>
						<SortableContext
							items={(enableRowDragAndDrop ? tableData : tableColumns).map((item: any) => item.companyId || item.accessorKey)}
							strategy={verticalListSortingStrategy}>
							<Table>
								<TableHeader className="bg-[#f3f4f6]">
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) =>
												enableColumnDragAndDrop ? (
													<SortableHeader
														key={header.id}
														header={header}
													/>
												) : (
													<TableHead
														key={header.id}
														className="p-4 text-left font-bold text-[#0a0a30]">
														{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
													</TableHead>
												)
											)}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows.length ? (
										table.getRowModel().rows.map((row) =>
											enableRowDragAndDrop ? (
												<SortableRow
													key={row.id}
													row={row}
												/>
											) : (
												<TableRow
													key={row.id}
													className="border-t border-gray-200">
													{row.getVisibleCells().map((cell) => (
														<TableCell
															key={cell.id}
															className="p-4">
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</TableCell>
													))}
												</TableRow>
											)
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center">
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</SortableContext>
					</DndContext>
				) : (
					<Table className="p-0 m-0">
						<TableHeader className="bg-gray-100">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow
									className="p-0 m-0"
									key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											className="text-xs whitespace-nowrap text-left font-bold text-[#0a0a30]">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.length && !loading ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="border-t">
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className={cell.column.id === 'actions' ? 'text-xs whitespace-nowrap sticky right-0 z-10' : 'text-xs whitespace-nowrap'}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center">
										{loading ? <Loading /> : 'No results'}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
