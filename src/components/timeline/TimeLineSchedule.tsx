import * as React from 'react';
import { addDays, addMonths, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectDetailsDialog } from './projects-details-dialog';
import type { Project } from './propsTypes';

interface TimelineCalendarProps {
	projects: Project[];
	currentDate?: Date;
}

type ViewType = 'weekly' | 'monthly';

export function TimelineCalendar({ projects, currentDate = new Date() }: TimelineCalendarProps) {
	const [viewType, setViewType] = React.useState<ViewType>('weekly');
	const [selectedDate, setSelectedDate] = React.useState(currentDate);
	const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

	// Memoize dates array to prevent unnecessary recalculations
	const dates = React.useMemo(() => {
		if (viewType === 'monthly') {
			return Array.from({ length: 12 }, (_, i) => addMonths(startOfMonth(selectedDate), i));
		}
		const weekStart = startOfWeek(selectedDate);
		return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	}, [selectedDate, viewType]);

	// Memoize unique managers
	const managers = React.useMemo(() => {
		return Array.from(new Set(projects.map((p) => p.manager.name)));
	}, [projects]);

	const navigate = (direction: 'prev' | 'next') => {
		setSelectedDate((prev) => {
			if (viewType === 'monthly') {
				return addMonths(prev, direction === 'prev' ? -12 : 12);
			}
			return addDays(prev, direction === 'prev' ? -7 : 7);
		});
	};

	const getProjectsForDate = React.useCallback(
		(date: Date) => {
			return projects.filter((project) => {
				const start = new Date(project.startDate);
				const end = new Date(project.endDate);
				return date >= start && date <= end;
			});
		},
		[projects]
	);

	const renderProjectCell = React.useCallback(
		(project: Project) => (
			<div
				key={project.projectId}
				className="absolute inset-0 m-1 text-center p-2 bg-[#fed7aa] cursor-pointer hover:bg-[#fdba74]"
				onClick={() => setSelectedProject(project)}>
				<span className="line-clamp-2 text-sm">{project.name}</span>
			</div>
		),
		[]
	);

	const renderMonthlyCalendar = React.useCallback(
		(date: Date) => {
			const monthStart = startOfMonth(date);
			const startDate = startOfWeek(monthStart);
			const weeks = [];
			let currentDate = startDate;

			for (let week = 0; week < 6; week++) {
				const weekDays = [];
				for (let day = 0; day < 7; day++) {
					const dayProjects = getProjectsForDate(currentDate);
					const hasProjects = dayProjects.length > 0;

					weekDays.push(
						<div
							key={currentDate.toISOString()}
							className={`
                p-2 border text-center relative min-h-[60px]
                ${!isSameMonth(currentDate, date) ? 'text-muted-foreground bg-muted/5' : ''}
              `}>
							<div className="text-sm mb-1">{format(currentDate, 'd')}</div>
							{hasProjects &&
								dayProjects.map((project) => (
									<div
										key={project.projectId}
										className="text-xs p-1 bg-[#fed7aa] cursor-pointer hover:bg-[#fdba74] mb-1"
										onClick={() => setSelectedProject(project)}>
										<span className="line-clamp-1">{project.name}</span>
									</div>
								))}
						</div>
					);
					currentDate = addDays(currentDate, 1);
				}
				weeks.push(
					<div
						key={week}
						className="grid grid-cols-7">
						{weekDays}
					</div>
				);
			}

			return (
				<div className="border">
					<div className="grid grid-cols-7 border-b">
						{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
							<div
								key={day}
								className="p-2 text-center font-medium text-sm">
								{day}
							</div>
						))}
					</div>
					{weeks}
				</div>
			);
		},
		[getProjectsForDate, setSelectedProject]
	);

	const renderWeeklyView = React.useCallback(
		() => (
			<div className={`grid grid-cols-[200px_repeat(${dates.length},1fr)]`}>
				<div className="p-2 font-medium border text-center bg-muted/20">Manager</div>
				{dates.map((date) => (
					<div
						key={date.toISOString()}
						className="p-2 text-center border text-sm bg-muted/20">
						<div className="font-medium">{format(date, 'EEE')}</div>
						<div>{format(date, 'd')}</div>
					</div>
				))}
				{managers.map((managerName) => {
					const managerProjects = projects.filter((p) => p.manager.name === managerName);
					return (
						<React.Fragment key={managerName}>
							<div className="p-2 border text-sm text-center font-medium bg-background">{managerName}</div>
							{dates.map((date) => {
								const projectsForDay = managerProjects.filter((p) => date >= new Date(p.startDate) && date <= new Date(p.endDate));
								return (
									<div
										key={date.toISOString()}
										className="border min-h-[60px] relative">
										{projectsForDay.map(renderProjectCell)}
									</div>
								);
							})}
						</React.Fragment>
					);
				})}
			</div>
		),
		[dates, managers, projects, renderProjectCell]
	);

	return (
		<div className="w-full border">
			<div className="flex items-center justify-between p-4 gap-4">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigate('prev')}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => navigate('next')}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				<div className="text-xl font-semibold">{viewType === 'monthly' ? format(selectedDate, 'yyyy') : format(selectedDate, 'MMM yyyy')}</div>

				<Select
					value={viewType}
					onValueChange={(value: ViewType) => setViewType(value)}>
					<SelectTrigger className="w-[120px]">
						<SelectValue
							defaultValue="weekly"
							placeholder="Select view"
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="weekly">Weekly</SelectItem>
						<SelectItem value="monthly">Monthly</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="p-4">
				{viewType === 'monthly' ? (
					<div className="grid grid-cols-3 gap-4">
						{dates.map((date) => (
							<div key={date.toISOString()}>
								<h3 className="text-lg font-semibold mb-2 text-center">{format(date, 'MMM yyyy')}</h3>
								{renderMonthlyCalendar(date)}
							</div>
						))}
					</div>
				) : (
					renderWeeklyView()
				)}
			</div>

			<ProjectDetailsDialog
				project={selectedProject}
				isOpen={!!selectedProject}
				onClose={() => setSelectedProject(null)}
			/>
		</div>
	);
}
