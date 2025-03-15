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
import { cn } from '@/lib/utils';

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
	columns: ColumnDefWithAccessor<TData, TValue>[];
	data: TData[];
	loading?: boolean;
	enableRowDragAndDrop?: boolean;
	enableColumnDragAndDrop?: boolean;
	isEditable?: boolean;
	setTableData?: React.Dispatch<React.SetStateAction<TData[]>>;
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
	customFields?: {
		[key: string]: {
			type: 'date' | 'time' | 'datetime';
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

const EditableCell = ({
	value: initialValue,
	row: { index },
	column: { id },
	updateData,
	isEditable,
	selectOptions,
	customField
}: {
	value: any;
	row: { index: number };
	column: { id: string };
	updateData: (index: number, id: string, value: any) => void;
	isEditable: boolean;
	selectOptions?: { value: string; label: string }[];
	customField?: { type: string };
}) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	if (!isEditable) {
		return <span className="text-xs">{value}</span>;
	}

	if (selectOptions) {
		return (
			<select
				value={value || ''}
				onChange={e => {
					setValue(e.target.value);
					updateData(index, id, e.target.value);
				}}
				className="w-full h-8 p-0 text-xs bg-transparent border-0 focus:ring-0"
			>
				<option value="">Select...</option>
				{selectOptions.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}

	if (customField?.type === 'date') {
		return (
			<input
				type="date"
				value={value || ''}
				onChange={e => {
					setValue(e.target.value);
					updateData(index, id, e.target.value);
				}}
				className="w-full h-8 p-0 text-xs bg-transparent border-0 focus:ring-0"
			/>
		);
	}

	return (
		<input
			value={value || ''}
			onChange={e => {
				setValue(e.target.value);
				updateData(index, id, e.target.value);
			}}
			className="w-full h-8 p-0 text-xs bg-transparent border-0 focus:ring-0"
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
	// onSave,
	onRowDragEnd,
	total = 0,
	currentPage = 1,
	onPageChange,
	pageSize = 10,
	selectFields,
	setTableData,
}: DataTableProps<TData, TValue>) {
	// const [tableData, setTableData] = useState<TData[]>(data);
	const [tableColumns, setTableColumns] = useState(() => columns);

	// Update tableData when data prop changes
	useEffect(() => {
		setTableData?.(data);
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
									setTableData?.((prevData: any) => {
										return prevData.map((row: any, rowIndex: any) => {
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
								setTableData?.((prevData: any) => {
									return prevData.map((row: any, rowIndex: any) => {
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
	}, [isEditable, columns, selectFields]); // Addedd nonEditableColumns from dependencies

	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

	const table = useReactTable({
		data: data,
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

			const oldIndex = data.findIndex((item: any) => item.id === active.id || item.companyId === active.id);
			const newIndex = data.findIndex((item: any) => item.id === over.id || item.companyId === over.id);

			if (oldIndex === -1 || newIndex === -1) return;

			const newData = arrayMove([...data], oldIndex, newIndex);
			setTableData?.(newData);

			if (onRowDragEnd) {
				onRowDragEnd({ oldIndex, newIndex });
			}
		},
		[data, onRowDragEnd]
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
					items={enableRowDragAndDrop ? data.map((item: any) => item.id || item.companyId) : tableColumns.map((item: any) => item.id || item.accessorKey)}
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
		[sensors, enableColumnDragAndDrop, enableRowDragAndDrop, handleColumnDragEnd, handleRowDragEnd, data, tableColumns, table, columns, loading]
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
			<div className="w-full bg-white border-t border-b border-r">
				{enableRowDragAndDrop || enableColumnDragAndDrop ? (
					dndContent
				) : (
					<>
						<div className="relative w-full overflow-x-auto">
							<Table>
								<TableHeader className="sticky top-0 z-20 bg-gray-100">
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												const isNumeric = header.column.columnDef.type === 'number';
												const isAction = header.column.id === 'detail' || header.column.id === 'actions';
												const isImage = header.column.id === 'logo' || header.column.id === 'profileimage';
												
												return (
													<TableHead
														key={header.id}
														style={{ 
															minWidth: isImage ? '60px' : '150px',
															width: isImage ? '60px' : 'auto',
															padding: isImage ? '0' : undefined, // Explicitly remove padding for image columns
														}}
														className={cn(
															"text-xs whitespace-nowrap text-left font-bold text-[#0a0a30]",
															isNumeric && "text-right",
															isAction && "sticky right-0 bg-gray-100 w-[100px] shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.2)]",
															!isImage && "", // Only add padding if not an image column
															isImage && "!p-0 !m-0" // Force remove all padding and margin for image columns
														)}>
														{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody>
									{table.getRowModel().rows?.length ? (
										table.getRowModel().rows.map((row) => (
											<TableRow key={row.id} className="border-t">
												{row.getVisibleCells().map((cell) => {
													const isNumeric = cell.column.columnDef.type === 'number';
													const isAction = cell.column.id === 'detail' || cell.column.id === 'actions';
													const isImage = cell.column.columnDef.type === 'image';
													
													return (
														<TableCell
															key={cell.id}
															style={{ 
																width: isImage ? '60px' : 'auto',
																minWidth: isImage ? '60px' : '150px',
																padding: 0,
																margin: 0,
															}}
															className={cn(
																"text-xs whitespace-nowrap border-b",
																isNumeric && "text-right",
																isAction && "sticky right-0 bg-white z-10 w-[100px] shadow-[-4px_0_8px_-6px_rgba(0,0,0,0.2)]",
																!isImage && !isAction && "px-4 py-4",
																isImage && "!p-0 !m-0 w-[60px]", // Force exact width and remove padding/margin
															)}>
															<div className={cn(
																"flex h-full",
																isNumeric && "justify-end",
																isAction && "justify-center",
																!isNumeric && !isAction && "justify-start",
																isImage && "!p-0 !m-0 w-[60px]", // Force exact width and remove padding/margin
																"items-center"
															)}>
																{flexRender(cell.column.columnDef.cell, cell.getContext())}
															</div>
														</TableCell>
													);
												})}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={columns.length} className="h-24 text-center">
												{loading ? <Loading /> : 'No results'}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
						{onPageChange && (
							<div className="flex items-center justify-between px-4 py-4 border-t">
								<div className="flex-1 text-sm text-gray-500">
									{/* If you want to show total records info */}
									Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} entries
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => onPageChange(currentPage - 1)}
										disabled={currentPage <= 1}
										className="w-8 h-8 p-0"
									>
										<ChevronLeft className="w-4 h-4" />
									</Button>
									<div className="flex items-center gap-1">
										<Input
											type="number"
											min={1}
											max={Math.ceil(total / pageSize)}
											value={currentPage}
											onChange={(e) => onPageChange(Number(e.target.value))}
											className="w-16 h-8 text-center"
										/>
										<span className="text-sm text-gray-500">
											of {Math.ceil(total / pageSize)}
										</span>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onPageChange(currentPage + 1)}
										disabled={currentPage >= Math.ceil(total / pageSize)}
										className="w-8 h-8 p-0"
									>
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
