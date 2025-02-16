import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MenuList from "@/components/menuList";
import { Button } from "@/components/ui/button";
import {
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
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/employee/setting/category/")({
    component: RouteComponent,
});

// Define the data row type
type CategoryRow = {
    categoryName: string;
    type: string;
    parentCategory: string;
    action: string;
};

const data: CategoryRow[] = [
    {
        categoryName: "Basic information",
        type: "Category",
        parentCategory: "Basic information",
        action: "VIEW",
    },
    {
        categoryName: "SNS",
        type: "Custom data",
        parentCategory: "Basic information",
        action: "VIEW",
    },
    {
        categoryName: "Regal",
        type: "osCloud app data",
        parentCategory: "Basic information",
        action: "VIEW",
    },
];

const columns = [
    {
        accessorKey: "categoryName",
        header: "Category",
    },
    {
        accessorKey: "parentCategory",
        header: "Parent Category",
    },
    {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }: { row: any }) => (
            <Link
                to={`/employee/setting/category/$categoryName`}
                params={{ categoryName: row.original.categoryName }}
            >
                <Button className="w-20 text-black bg-transparent border rounded-none link">
                    {row.original.action}
                </Button>
            </Link>
        ),
    },
];

const SortableRow = ({ row, id }: { row: any; id: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : "auto",
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes}>
            {row.getVisibleCells().map((cell: any) => (
                <td className="p-4" key={cell.id} {...listeners}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
};

function RouteComponent() {
    const [items, setItems] = React.useState(data);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.categoryName === active.id
                );
                const newIndex = items.findIndex(
                    (item) => item.categoryName === over.id
                );
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    return (
        <div className="flex-1 h-full">
            <div className="flex-none min-h-0 border-b">
                <div className="container">
                    <MenuList
                        items={[
                            {
                                label: "Data Field",
                                path: "/employee/setting",
                            },
                            {
                                label: "Category",
                                path: "/employee/setting/category",
                            },
                            {
                                label: "Department",
                                path: "/employee/setting/department",
                            },
                        ]}
                    />
                </div>
            </div>

            <div className="flex justify-end flex-none w-full">
                <Button className="w-20 text-black bg-transparent border link border-r-none min-h-14">
                    ADD+
                </Button>
                <Button className="w-20 text-black bg-transparent border link min-h-14">
                    EDIT
                </Button>
            </div>

            <div className="flex-1">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <table className="w-full bg-white border-t border-b border-gray-200 rounded-md shadow-sm">
                        <thead className="bg-[#f3f4f6]">
                            <tr>
                                <th className="p-4 font-bold text-left text-[#0a0a30]">
                                    Category
                                </th>
                                <th className="p-4 font-bold text-left text-[#0a0a30]">
                                    Parent Category
                                </th>
                                <th className="p-4 font-bold text-left text-[#0a0a30]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <SortableContext
                            items={items.map((item) => item.categoryName)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody className="divide-y divide-gray-200">
                                {table.getRowModel().rows.map((row) => (
                                    <SortableRow
                                        key={row.id}
                                        row={row}
                                        id={row.original.categoryName}
                                    />
                                ))}
                            </tbody>
                        </SortableContext>
                    </table>
                </DndContext>
            </div>
        </div>
    );
}
