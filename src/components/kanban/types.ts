export interface KanbanCard {
	id: string;
	company: string;
	personnel: string;
	title: string;
	addedOn: string;
	manager: string;
	contractValue: string;
}

export interface Lead {
	id: string;
	company: string;
	personnel: string;
	title: string;
	addedOn: string;
	manager: string;
	contractValue: string;
	status: 'Active' | 'Pending' | 'Completed';
}

export interface KanbanColumnTypes {
	id: string;
	title: string;
	color: string;
	leads: Lead[];
}

export interface KanbanBoardProps {
	columns: KanbanColumnTypes[];
	onColumnUpdate: (columns: KanbanColumnTypes[]) => void;
}

export interface KanbanBoard {
	columns: KanbanColumnTypes[];
}
