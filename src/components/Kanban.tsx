import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const KanbanBoard = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex gap-4 p-4">{children}</div>;
};

export const KanbanColumn = ({
    id,
    title,
    color,
    children,
}: {
    id: string;
    title: string;
    color: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex-1 p-4 bg-gray-100 rounded-lg">
            <h3 className={`${color} text-white p-2 rounded-t-lg`}>{title} {id}</h3>
            <div className="mt-2">{children}</div>
        </div>
    );
};

export const KanbanCard = ({
    id,
    companyName,
    personnelName,
    projectName,
    startDate,
    manager,
    contractValue,
}: {
    id: number;
    companyName: string;
    personnelName: string;
    projectName: string;
    startDate: string;
    manager: string;
    contractValue: string;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 mb-2 bg-white rounded-lg shadow-sm"
        >
            <p className="font-semibold">{companyName}</p>
            <p>{personnelName}</p>
            <p className="text-sm text-gray-500">{projectName}</p>
            <div className="flex justify-between mt-2">
                <p>{startDate}</p>
                <p>{manager}</p>
            </div>
            <p className="mt-2 font-semibold">{contractValue}</p>
        </div>
    );
};