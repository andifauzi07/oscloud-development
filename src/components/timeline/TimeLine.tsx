import { Button } from '../ui/button';
import EventModal, { ColorScheme } from '@/components/timeline/Calendar';
// import { Event } from '../../types/event';
import { addDays, areIntervalsOverlapping, differenceInMinutes, format, getISOWeek, isSameDay, isToday, startOfWeek } from 'date-fns';
import { allDayEvents, AllDayEventViewProps, CalendarEvent, calendarEvents, Categories, DayViewEventProps } from '@/config/mockData/calendarData';
import { mockEmployeTimeline } from '@/config/mockData/timeline';
interface WeekViewProps {
	currentDate: Date;
	events: string;
}

export function TimeLine({ currentDate, events }: WeekViewProps) {
	console.log('--->>> events: ', events);
	// const weekNumber = getISOWeek(currentDate);
	const firstWeekDay = startOfWeek(currentDate, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(firstWeekDay, i));

	// const mappedEvents: CalendarEvent[] = events.map(({eventname: title, description, startdate, starttime, enddate, endtime, ...rest}) => ({
	//     title,
	//     description,
	//     from: new Date(`${startdate} ${starttime}`),
	//     to: new Date(`${enddate} ${endtime}`),
	//     category: (rest.colorSchema === 'default' ? 'yellow' : (
	//         rest.colorSchema === 'red' ? 'purple' : rest.colorSchema
	//     ))

	// }));
	return (
		<div className="p-4 border shadow-sm bg-card text-card-foreground">
			<div className="relative z-20 mb-4">
				<div className="grid grid-cols-8 gap-0">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={`week-view-top-header-${i}`}
							className="text-xs font-semibold text-center"></div>
					))}
				</div>
				{/* {(allDayEvents ?? []).length && <AllDayEventsView events={allDayEvents} />} */}
			</div>
			<div
				dir="ltr"
				className="relative overflow-hidden h-[600px]">
				<div
					data-radix-scroll-area-viewport=""
					className="h-full w-full rounded-[inherit]"
					style={{ overflow: 'hidden scroll' }}>
					<div style={{ minWidth: '100%', display: 'table' }}>
						<div className="relative mb-2">
							<div className="grid grid-cols-8 gap-0">
								<button
									className="sticky top-0 left-0 z-30 bg-background"
									type="button"
									aria-haspopup="dialog"
									aria-expanded="false"
									aria-controls="radix-:r3j6:"
									data-state="closed">
									<div className="sticky top-0 left-0 flex items-center justify-center h-12 border-b border-r bg-background border-border">
										<span className="text-xs font-semibold text-muted-foreground bg-background">Manager</span>
									</div>

									{mockEmployeTimeline.map((employee) => (
										<div
											key={employee.name}
											className="h-16 text-sm text-center border-r cursor-pointer border-border">
											<div className="flex items-center justify-start gap-2 py-4">
												<img
													src="./vite.svg"
													alt={employee.name}
												/>
												<h2>{employee.name}</h2>
											</div>
										</div>
									))}
								</button>
								<div className="relative z-10 col-span-7">
									<div className="grid grid-cols-7 gap-0">
										{weekDays.map((weekDay, i) => (
											<DayView
												key={`week-day-${i}`}
												events={calendarEvents}
												day={weekDay}
											/>
										))}
										<div className="absolute top-0 right-0 w-px h-full bg-border"></div>
									</div>
								</div>
							</div>
							<div
								className="absolute left-[12.5%] right-0 h-px bg-primary z-40 pointer-events-none"
								style={{ display: 'none' }}>
								<span className="absolute left-0 px-1 text-xs transform -translate-x-full -translate-y-1/2 rounded bg-primary text-primary-foreground"></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function AllDayEventView({ event: { title, description }, isLast = false }: AllDayEventViewProps) {
	return (
		<div className="min-h-[24px] px-1">
			<button
				className={`w-full bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded cursor-pointer transition-colors duration-200 hover:bg-opacity-40 dark:hover:bg-opacity-40 min-h-[24px] text-xs border-x-0 ${
					isLast ? 'border-r-4 border-r-black/70 dark:border-r-white/50' : ''
				}`}
				type="button"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls="radix-:r3iq:"
				data-state="closed">
				<div className="font-semibold truncate">{title}</div>
				<div className="truncate">{description}</div>
			</button>
		</div>
	);
}

export interface AllDayEventsViewProps {
	events: AllDayEventViewProps['event'][];
}

export function AllDayEventsView({ events = [] }: AllDayEventsViewProps) {
	return (
		<div className="relative grid grid-cols-8 gap-0">
			<div className="absolute left-0 top-0 bottom-2 w-[12.5%] flex items-center justify-center z-10">
				<div className="text-xs font-semibold truncate whitespace-nowrap">Full-Day Events ({events.length})</div>
			</div>
			<div
				className="grid grid-cols-8 col-span-8 gap-0 mb-1"
				style={{ opacity: 1, willChange: 'opacity', transform: 'none' }}>
				<div className="w-[12.5%]"></div>
				{events.map((event, i) => (
					<AllDayEventView
						key={`all-day-event-${i}`}
						event={event}
						isLast={events.length === i + 1}
					/>
				))}
				{Array.from({ length: 7 - events.length }).map((_, i) => (
					<div
						key={`all-day-event-placeholder-${i}`}
						className="min-h-[24px] px-1"></div>
				))}
			</div>
		</div>
	);
}

export function DayViewEvent({ event: { title, description, from, to, category = 'blue' }, width = 100, widthOffsetIndex = 1, onClick }: DayViewEventProps) {
	const hourCellHeight = 64;
	const hour = from.getHours();
	const minutes = from.getMinutes();
	const minsInHour = 60;
	const inHours = (hour * minsInHour + minutes) / minsInHour;
	const top = inHours * hourCellHeight;
	const durationInMinutes = differenceInMinutes(to, from);
	const durationInHours = durationInMinutes / 60;
	const height = Math.round(durationInHours * hourCellHeight);
	const categoryStyles = Categories[category].class;
	const left = width === 100 ? 0 : widthOffsetIndex * width;

	return (
		<Button
			className={`absolute justify-start overflow-hidden w-full flex flex-col border-opacity-70 border-l-4 items-start p-1 text-[8px] h-10 sm:text-xs rounded mb-1 cursor-pointer transition-colors duration-200 ${categoryStyles} hover:bg-opacity-85 dark:hover:bg-opacity-40 will-change-transform`}
			type="button"
			variant={'ghost'}
			onClick={onClick}
			style={{
				top: `${top}px`,
				height: `${height}px`,
				left: `${left}%`,
				width: `${width}%`,
			}}>
			<div className="w-full max-w-md truncate">
				<h2 className="font-semibold text-left truncate">{title}</h2>
			</div>
			{description && (
				<div className="hidden w-full max-w-md truncate sm:block">
					<p className="font-light text-left truncate">{description}</p>
				</div>
			)}
			<div className="text-xs">
				{format(from, 'HH:mm')} - {format(to, 'HH:mm')}
			</div>
		</Button>
	);
}

export interface DayViewProps {
	events: CalendarEvent[];
	day: Date;
}

export function DayView({ events = [], day }: DayViewProps) {
	const dayAsString = format(day, 'E');
	const dayInTheMonth = format(day, 'd');
	const dayEvents = events.filter((event) => isSameDay(event.from, day));
	const eventsWithOverlap = dayEvents.map((event) => {
		const overlapingEvents = dayEvents.filter((evt) => areIntervalsOverlapping({ start: evt.from, end: evt.to }, { start: event.from, end: event.to })) || [];
		return { event, overlapingEvents };
	}, {});
	const isTodaysDate = isToday(day);

	return (
		<div className="relative">
			<div className="sticky top-0 z-20 flex items-center justify-center h-12 border-b bg-background border-border">
				<div className="flex flex-row items-center justify-center gap-2 text-center">
					<div className={`${isTodaysDate ? 'bg-primary text-primary-foreground' : ''} text-sm rounded-full w-6 h-6 flex items-center justify-center mx-auto`}>{dayInTheMonth}</div>
					<div className="text-xs font-semibold">( {dayAsString} )</div>
				</div>
			</div>
			<div className="relative h-[calc(100%-3rem)]">
				{/* Render Hours Cells */}
				{Array.from({ length: 24 }).map((_, i) => (
					<div
						key={`day-${dayInTheMonth}-${i}`}
						className={`h-16 ${i > 0 ? 'border-t border-border' : ''} ${i == 24 - 1 ? 'border-b' : ''}`}></div>
				))}
				{/* Render Events */}
				{eventsWithOverlap.map(({ event, overlapingEvents }, i) => (
					<EventModal
						key={`event-modal-${i}`}
						trigger={
							<DayViewEvent
								key={`day-${dayInTheMonth}-event-${i}`}
								event={event}
								width={overlapingEvents.length === 0 ? 100 : Math.round(100 / overlapingEvents.length)}
								widthOffsetIndex={overlapingEvents.findIndex(({ title, description, from, to }) => title === event.title && description === event.description && from === event.from && to === event.to)}
							/>
						}
						eventdetails={{
							eventname: event.title,
							description: event.description!,
							// startdate: '',
							// starttime: '',
							// enddate: '',
							// endtime: '',
							colorScheme: (event.category === 'purple' ? 'red' : event.category === 'yellow' ? 'default' : event.category) as ColorScheme,
						}}
					/>
				))}
			</div>
			{/* Day's Vertical Separator Line */}
			<div className="absolute top-12 right-0 w-px h-[calc(100%-3rem)] bg-border"></div>
		</div>
	);
}
