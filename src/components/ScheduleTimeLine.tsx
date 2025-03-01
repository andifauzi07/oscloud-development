import React, { useMemo } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { ChevronDown } from 'lucide-react';

interface ScheduleItem {
    manager: {
        name: string;
    };
    name: string;
    startDate: string | null;
    endDate: string | null;
    startdate?: string | null; // Optional: for compatibility with older data
    enddate?: string | null;   // Optional: for compatibility with older data
    [key: string]: any; // Allow for other properties
}

interface ManagerGroup {
    name: string;
    items: ScheduleItem[];
}

interface ScheduleTableProps {
    data: ScheduleItem[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ data }) => {
    const managers: ManagerGroup[] = useMemo(() => {
        const managersMap = new Map<string, ManagerGroup>();

        data.forEach((item) => {
            const managerName = item.manager?.name || "Unknown Manager";
            if (!managersMap.has(managerName)) {
                managersMap.set(managerName, { name: managerName, items: [] });
            }
            managersMap.get(managerName)!.items.push(item);
        });

        return Array.from(managersMap.values());
    }, [data]);

    const getMinMaxDates = (managers: ManagerGroup[]) => {
        let minDate = new Date();
        let maxDate = new Date();
        if (managers.length > 0) {
            minDate = new Date(
                Math.min(
                    ...managers.flatMap((m) =>
                        m.items.map((p) => {
                            const start = p.startDate || p.startdate;
                            return start ? parseISO(start).getTime() : new Date().getTime();
                        })
                    )
                )
            );
            maxDate = new Date(
                Math.max(
                    ...managers.flatMap((m) =>
                        m.items.map((p) => {
                            const end = p.endDate || p.enddate;
                            return end ? parseISO(end).getTime() : new Date().getTime();
                        })
                    )
                )
            );
        }
        return { minDate, maxDate };
    };

    const { minDate, maxDate } = getMinMaxDates(managers);
    const daysInRange: Date[] = [];

    for (let day = minDate; day <= maxDate; day = addDays(day, 1)) {
        daysInRange.push(new Date(day));
    }

    return (
        <div className="w-full overflow-auto">
            <table className="w-full py-8 text-sm border-collapse">
                <thead className="w-full">
                    <tr className="w-full bg-gray-100">
                        <th rowSpan={2} className="w-32 px-16 py-1 border-t border-b">
                            Manager
                        </th>
                        <th className="px-16 py-1 border" colSpan={daysInRange.length}>
                            <div className="flex justify-between w-full">
                                <div>{format(minDate, "yyyy MMMM")}</div>
                                <button className="flex">
                                    Weekly <ChevronDown />
                                </button>
                            </div>
                        </th>
                    </tr>
                    <tr className="w-full bg-gray-100">
                        {daysInRange.map((day, index) => (
                            <th key={index} className="px-16 py-1 text-center border">
                                {format(day, "dd (EEE)")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {managers.map((manager, managerIndex) => (
                        <tr key={managerIndex} className="">
                            <td className="py-2 font-bold text-center bg-white border-b whitespace-nowrap">
                                {manager.name}
                            </td>
                            {daysInRange.map((day, dayIndex) => {
                                const item = manager.items.find((p) => {
                                    const start = p.startDate || p.startdate;
                                    const end = p.endDate || p.enddate;
                                    if (!start || !end) return false;
                                    const startDate = parseISO(start);
                                    const endDate = parseISO(end);
                                    return day >= startDate && day <= endDate;
                                });
                                return (
                                    <td key={dayIndex} className="relative px-16 py-2 border">
                                        {item && (
                                            <div
                                                className={`p-2 absolute inset-0 flex items-center justify-center bg-blue-200 text-xs text-black px-2 py-1 whitespace-nowrap`}
                                            >
                                                {item.name}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;
