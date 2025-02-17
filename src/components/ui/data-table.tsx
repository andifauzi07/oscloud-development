import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]; 
    data: TData[];
    enableRowDragAndDrop?: boolean;
    enableColumnDragAndDrop?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    enableRowDragAndDrop = false,
    enableColumnDragAndDrop = false,
}: DataTableProps<TData, TValue>) {
    const [tableData, setTableData] = useState(data);
    const [tableColumns, setTableColumns] = useState(columns);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

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
            const oldIndex = prev.findIndex((item: any) => item.id === active.id);
            const newIndex = prev.findIndex((item: any) => item.id === over.id);
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
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.original.id });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners} className="border-t border-gray-200">
                {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="p-4">
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
                className="p-4 text-left font-bold text-[#0a0a30] cursor-pointer"
            >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
        );
    };

    return (
        <div className="w-full bg-white border-t border-b border-gray-200">
            {(enableRowDragAndDrop || enableColumnDragAndDrop) ? (
                <DndContext
                    sensors={sensors}
                    onDragEnd={(event) => {
                        if (enableColumnDragAndDrop) {
                            handleColumnDragEnd(event);
                        } else if (enableRowDragAndDrop) {
                            handleRowDragEnd(event);
                        }
                    }}
                >
                    <SortableContext
                        items={(enableRowDragAndDrop ? tableData : tableColumns).map((item: any) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table>
                            <TableHeader className="bg-[#f3f4f6]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            enableColumnDragAndDrop ? (
                                                <SortableHeader key={header.id} header={header} />
                                            ) : (
                                                <TableHead key={header.id} className="p-4 text-left font-bold text-[#0a0a30]">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            )
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => enableRowDragAndDrop ? <SortableRow key={row.id} row={row} /> : (
                                        <TableRow key={row.id} className="border-t border-gray-200">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="p-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>
            ) : (
                <Table>
                    <TableHeader className="bg-[#f3f4f6]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="p-4 text-left font-bold text-[#0a0a30]">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="border-t border-gray-200">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
