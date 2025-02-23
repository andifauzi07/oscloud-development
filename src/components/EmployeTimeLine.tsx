import React from 'react';
import { format, addDays } from 'date-fns';

interface Project {
	name: string;
	start: Date;
	end: Date;
	color: string;
}

interface Manager {
	name: string;
	projects: Project[];
}

const managers: Manager[] = [
	{
		name: 'Messi',
		projects: [{ name: 'Cloud Platform UI Redesign', start: new Date(2024, 1, 2), end: new Date(2024, 1, 3), color: 'bg-blue-300' }],
	},
	{
		name: 'Ronaldo',
		projects: [{ name: 'IT Infrastructure Upgrade', start: new Date(2024, 1, 1), end: new Date(2024, 1, 4), color: 'bg-red-500' }],
	},
	{
		name: 'Pogba',
		projects: [{ name: 'Network Instalation ', start: new Date(2024, 1, 3), end: new Date(2024, 1, 4), color: 'bg-orange-200' }],
	},
	{
		name: 'Casemiro',
		projects: [{ name: 'Software Maintenance', start: new Date(2024, 1, 1), end: new Date(2024, 1, 2), color: 'bg-blue-100' }],
	},
	{
		name: 'Cungcung',
		projects: [{ name: 'Customare Care', start: new Date(2024, 1, 3), end: new Date(2024, 1, 5), color: 'bg-green-100' }],
	},
	{
		name: 'Compak',
		projects: [{ name: 'Service Product', start: new Date(2024, 1, 1), end: new Date(2024, 1, 1), color: 'bg-yellow-100' }],
	},
];

const getMinMaxDates = (managers: Manager[]) => {
	let minDate = new Date(Math.min(...managers.flatMap((m) => m.projects.map((p) => p.start.getTime()))));
	let maxDate = new Date(Math.max(...managers.flatMap((m) => m.projects.map((p) => p.end.getTime()))));
	return { minDate, maxDate };
};

const ScheduleTable: React.FC = () => {
	const { minDate, maxDate } = getMinMaxDates(managers);
	const daysInRange: Date[] = [];

	for (let day = minDate; day <= maxDate; day = addDays(day, 1)) {
		daysInRange.push(new Date(day));
	}

	return (
		<div className="overflow-auto w-full">
			<table className="border-collapse border w-full text-sm">
				<thead className="w-full">
					<tr className="bg-gray-100 w-full">
						<th
							rowSpan={2}
							className="border px-16 py-1 w-32">
							Manager
						</th>
						<th
							className="border px-16 py-1"
							colSpan={daysInRange.length}>
							{format(minDate, 'yyyy MMMM')}
						</th>
					</tr>
					<tr className="bg-gray-100 w-full">
						{daysInRange.map((day, index) => (
							<th
								key={index}
								className="border px-16 py-1 text-center">
								{format(day, 'dd (EEE)')}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{managers.map((manager, index) => (
						<tr
							key={index}
							className="border">
							<td className="border font-bold py-2 text-center bg-white whitespace-nowrap">{manager.name}</td>
							{daysInRange.map((day, index) => {
								const project = manager.projects.find((p) => day >= p.start && day <= p.end);
								return (
									<td
										key={index}
										className="border relative px-16 py-2">
										{project && <div className={`p-2 absolute inset-0 flex items-center justify-center ${project.color} text-xs text-black px-2 py-1 whitespace-nowrap`}>{project.name}</div>}
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
