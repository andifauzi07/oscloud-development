import { CellContext, ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Input } from './input';
import { Button } from './button';
import Loading from '../Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const preloadImage = (src: string) => {
	if (!src) return;
	const img = new Image();
	img.src = src;
};

// Add a type helper for the column definition
type ColumnDefWithAccessor<TData, TValue> = ColumnDef<TData, TValue> & {
	accessorKey?: string;
	id?: string;
};

export interface DataTableProps<TData, TValue> {
	columns: ColumnDefWithAccessor<TData, TValue>[]; // Update this type
	data: TData[];
	loading?: boolean;
	enableRowDragAndDrop?: boolean;
	enableColumnDragAndDrop?: boolean;
	isEditable?: boolean;
	nonEditableColumns?: string[];
	onSave?: (data: TData[]) => void;
	onRowDragEnd?: (result: { oldIndex: number; newIndex: number }) => void;
	total?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	pageSize?: number;
	selectFields?: {
		[key: string]: {
			options: { value: string; label: string }[];
		};
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

// Memoized Table Row component
const TableRowMemo = memo(({ row, columns }: { row: any; columns: any[] }) => (
	<TableRow className="border-t">
		{row.getVisibleCells().map((cell: any) => (
			<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
		))}
	</TableRow>
));
TableRowMemo.displayName = 'TableRowMemo';

export function DataTable<TData, TValue>({
	columns,
	data,
	loading = false,
	enableRowDragAndDrop = false,
	enableColumnDragAndDrop = false,
	isEditable = false,
	nonEditableColumns = [], // Provide empty array as default
	onSave,
	onRowDragEnd,
	total = 0,
	currentPage = 1,
	onPageChange,
	pageSize = 10,
	selectFields,
}: DataTableProps<TData, TValue>) {
	const [tableData, setTableData] = useState<TData[]>(data);
	const [tableColumns, setTableColumns] = useState(() => columns);

	// Update tableData when data prop changes
	useEffect(() => {
		setTableData(data);
	}, [data]);

	// Update columns when isEditable, columns or nonEditableColumns change
	useEffect(() => {
		const editableColumns = columns.map((col) => {
			const columnId = col.id || col.accessorKey || '';

			const shouldEdit =
				isEditable &&
				!nonEditableColumns.some((pattern) => {
					if (typeof pattern !== 'string') return false;
					if (pattern.endsWith('*')) {
						const prefix = pattern.slice(0, -1);
						return columnId.startsWith(prefix);
					}
					return columnId === pattern;
				});

			if (shouldEdit) {
				const isSelectField = selectFields && columnId && selectFields[columnId];

				if (isSelectField) {
					return {
						...col,
						cell: (props: CellContext<TData, TValue>) => (
							<select
								value={props.getValue() as string}
								onChange={(e) => {
									setTableData((prevData) => {
										return prevData.map((row, rowIndex) => {
											if (rowIndex === props.row.index) {
												return { ...row, [columnId]: e.target.value };
											}
											return row;
										});
									});
								}}
								className="h-8 p-0 text-xs bg-transparent border-0 focus:ring-0">
								{selectFields[columnId].options.map((option) => (
									<option
										key={option.value}
										value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						),
					};
				}

				return {
					...col,
					cell: (props: CellContext<TData, TValue>) => (
						<EditableCell
							value={props.getValue()}
							row={{ index: props.row.index, original: props.row.original }}
							column={{ id: columnId }}
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
					),
				};
			}
			return col;
		});
		setTableColumns(editableColumns);
	}, [isEditable, columns, selectFields]); // Remove nonEditableColumns from dependencies

	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

	const table = useReactTable({
		data: tableData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableSorting: false,
		enableMultiSort: false,
	});

	// Handle row drag-and-drop
	const handleRowDragEnd = useCallback(
		(event: any) => {
			const { active, over } = event;
			if (!active || !over || active.id === over.id) return;

			const oldIndex = tableData.findIndex((item: any) => item.id === active.id || item.companyId === active.id);
			const newIndex = tableData.findIndex((item: any) => item.id === over.id || item.companyId === over.id);

			if (oldIndex === -1 || newIndex === -1) return;

			const newData = arrayMove([...tableData], oldIndex, newIndex);
			setTableData(newData);

			if (onRowDragEnd) {
				onRowDragEnd({ oldIndex, newIndex });
			}
		},
		[tableData, onRowDragEnd]
	);

	// Handle column drag-and-drop
	const handleColumnDragEnd = useCallback(
		(event: any) => {
			const { active, over } = event;
			if (!active || !over || active.id === over.id) return;

			const oldIndex = tableColumns.findIndex((col) => col.id === active.id);
			const newIndex = tableColumns.findIndex((col) => col.id === over.id);

			if (oldIndex === -1 || newIndex === -1) return;

			setTableColumns((prev) => arrayMove([...prev], oldIndex, newIndex));
		},
		[tableColumns]
	);

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

	// Memoize the DndContext content
	const dndContent = useMemo(
		() => (
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
					items={enableRowDragAndDrop ? tableData.map((item: any) => item.id || item.companyId) : tableColumns.map((item: any) => item.id || item.accessorKey)}
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
										<TableRowMemo
											key={row.id}
											row={row}
											columns={columns}
										/>
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
		),
		[sensors, enableColumnDragAndDrop, enableRowDragAndDrop, handleColumnDragEnd, handleRowDragEnd, tableData, tableColumns, table, columns, loading]
	);

	const totalPages = Math.ceil(total / pageSize);

	const handleNextPage = () => {
		if (currentPage < totalPages && onPageChange) {
			onPageChange(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1 && onPageChange) {
			onPageChange(currentPage - 1);
		}
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
					dndContent
				) : (
					<>
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
													className={cell.column.id === 'actions' || cell.column.id === 'detail' ? 'text-xs whitespace-nowrap sticky right-0 z-10' : 'text-xs whitespace-nowrap'}>
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
						{onPageChange && (
							<div className="flex items-center justify-between px-4 py-4 border-t">
								<div className="text-sm text-gray-500">
									Page {currentPage} of {totalPages}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={handlePrevPage}
										disabled={currentPage === 1 || loading}
										className="w-8 h-8 p-0">
										<ChevronLeft className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={handleNextPage}
										disabled={currentPage >= totalPages || loading}
										className="w-8 h-8 p-0">
										<ChevronRight className="w-4 h-4" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
