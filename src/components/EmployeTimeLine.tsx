import React, { useMemo } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

interface Project {
    projectId: number;
    name: string;
    startDate: string | null;
    endDate: string | null;
    startdate: string | null;
    enddate: string | null;
    manager: {
        userId: number;
        email: string;  // Changed from name to email
    };
    status: string | null;
    // ... other properties
}

interface Manager {
    email: string;     // Changed from name to email
    projects: Project[];
}

interface ScheduleTableProps {
    projects: Project[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ projects }) => {
    const managers: Manager[] = useMemo(() => {
        // Group projects by manager
        const managersMap = new Map<string, Manager>();

        projects.forEach((project) => {
            const managerEmail = project.manager?.email || "Unknown Email";  // Changed to use email
            if (!managersMap.has(managerEmail)) {
                managersMap.set(managerEmail, { email: managerEmail, projects: [] });  // Changed to use email
            }
            managersMap.get(managerEmail)!.projects.push(project);
        });

        return Array.from(managersMap.values());
    }, [projects]);

    const getMinMaxDates = (managers: Manager[]) => {
        let minDate = new Date();
        let maxDate = new Date();
        if(managers.length > 0){
            minDate = new Date(
                Math.min(
                    ...managers.flatMap((m) =>
                        m.projects.map((p) => {
                            const start = p.startDate || p.startdate;
                            return start ? parseISO(start).getTime() : new Date().getTime(); // Use a default date if startDate is null
                        })
                    )
                )
            );
             maxDate = new Date(
                Math.max(
                    ...managers.flatMap((m) =>
                        m.projects.map((p) => {
                            const end = p.endDate || p.enddate;
                            return end ? parseISO(end).getTime() : new Date().getTime(); // Use a default date if endDate is null
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
                        <th
                            rowSpan={2}
                            className="w-32 px-16 py-1 border-t border-b"
                        >
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
                                {manager.email}  {/* Changed from name to email */}
                            </td>
                            {daysInRange.map((day, dayIndex) => {
                                const project = manager.projects.find((p) => {
                                    const start = p.startDate || p.startdate;
                                    const end = p.endDate || p.enddate;
                                    if (!start || !end) return false; // Skip if start or end date is missing
                                    const startDate = parseISO(start);
                                    const endDate = parseISO(end);
                                    return day >= startDate && day <= endDate;
                                });
                                return (
                                    <td key={dayIndex} className="relative px-16 py-2 border">
                                        {project && (
                                            <div
                                                className={`p-2 absolute inset-0 flex items-center justify-center bg-blue-200 text-xs text-black px-2 py-1 whitespace-nowrap`}
                                            >
                                                {project.name}
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
