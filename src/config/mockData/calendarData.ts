export const allDayEvents: AllDayEventViewProps['event'][] = [
	{
		title: 'Ads Campaign Nr1',
		description: 'AdSense + FB, Target Audience: SMB2-Delta1',
	},
	{
		title: 'Ads Campaign Nr2',
		description: 'AdSense + FB, Target Audience: SMB2-Delta2',
	},
	{
		title: 'Ads Campaign Nr3',
		description: 'AdSense + FB, Target Audience: SMB2-Delta3',
	},
	{
		title: 'Ads Campaign Nr4',
		description: 'AdSense + FB, Target Audience: SMB2-Delta4',
	},
];

export interface AllDayEventViewProps {
	event: {
		title: string;
		description?: string;
	};
	isLast?: boolean;
}

export const calendarEvents: CalendarEvent[] = [
	{
		title: 'Meditation Session',
		from: new Date('November 11, 2024 02:33:00'),
		to: new Date('November 11, 2024 03:30:00'),
		category: 'blue',
	},
	{
		title: 'Code Review',
		from: new Date('November 11, 2024 04:00:00'),
		to: new Date('November 11, 2024 05:30:00'),
		category: 'yellow',
	},
	{
		title: 'Breakfast Break',
		from: new Date('November 11, 2024 06:30:00'),
		to: new Date('November 11, 2024 07:30:00'),
		category: 'green',
	},
	{
		title: 'Early Bird Workout',
		description: '#1 of 3',
		from: new Date('November 12, 2024 00:00:00'),
		to: new Date('November 12, 2024 01:30:00'),
		category: 'blue',
	},
	{
		title: 'Product Development Workshop',
		from: new Date('November 12, 2024 01:00:00'),
		to: new Date('November 12, 2024 05:00:00'),
		category: 'purple',
	},
	{
		title: 'Early Bird Workout',
		description: '#2 of 3',
		from: new Date('November 13, 2024 00:00:00'),
		to: new Date('November 13, 2024 01:30:00'),
		category: 'blue',
	},
	{
		title: 'Early Bird Workout',
		description: '#3 of 3',
		from: new Date('November 14, 2024 00:00:00'),
		to: new Date('November 14, 2024 01:30:00'),
		category: 'blue',
	},
	{
		title: 'Investor Presentation',
		from: new Date('November 15, 2024 06:30:00'),
		to: new Date('November 15, 2024 08:30:00'),
		category: 'yellow',
	},
	{
		title: 'Team Breakfast',
		from: new Date('November 15, 2024 08:00:00'),
		to: new Date('November 15, 2024 09:00:00'),
		category: 'green',
	},
];

export const Categories: { [key: string]: { class: string } } = {
	blue: {
		class: `bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-l-blue-600 dark:border-l-blue-400`,
	},
	green: {
		class: `bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 border-l-green-600 dark:border-l-green-400`,
	},
	yellow: {
		class: `bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-l-yellow-600 dark:border-l-yellow-400`,
	},
	purple: {
		class: `bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-l-purple-600 dark:border-l-purple-400`,
	},
};

export type CategoryTypes = keyof typeof Categories;

export interface CalendarEvent {
	title: string;
	description?: string;
	from: Date;
	to: Date;
	category?: CategoryTypes;
}

export interface DayViewEventProps {
	event: CalendarEvent;
	width?: number;
	// Offset (in width units) from the left (0 based)
	widthOffsetIndex?: number;
	onClick?: () => void; // Optional onClick prop
}
