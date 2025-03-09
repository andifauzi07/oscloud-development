import { useState, useEffect, useCallback, useRef } from 'react';
import type { KanbanBoardProps, KanbanColumnTypes, Lead } from './types';
import { KanbanColumnContainer } from './kanban-column';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCardItem } from './kanban-card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function KanbanBoard({ columns: initialColumns, onColumnUpdate }: KanbanBoardProps) {
	// Column states
	const [columns, setColumns] = useState<KanbanColumnTypes[]>(initialColumns);
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');
	const [newColumnColor, setNewColumnColor] = useState('bg-gray-500');

	// Card states
	const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
	const [currentLead, setCurrentLead] = useState<Lead>({
		id: '',
		company: '',
		personnel: '',
		title: '',
		addedOn: '',
		manager: '',
		contractValue: '',
		status: ''
	});

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	);

	// Add these new states for drag animation
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeLead, setActiveLead] = useState<Lead | null>(null);

	// Helper function to update columns and notify parent
	const updateColumns = (newColumns: KanbanColumnTypes[]) => {
		setColumns(newColumns);
		if (onColumnUpdate) {
			onColumnUpdate(newColumns);
		}
	};

	useEffect(() => {
		setColumns(initialColumns);
	}, [initialColumns]);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);
		
		const draggedLead = columns
			.flatMap(col => col.leads)
			.find(lead => lead.id === active.id);
			
		if (draggedLead) {
			setActiveLead(draggedLead);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		const sourceColumn = columns.find(col => 
			col.leads.some(lead => lead.id === activeId)
		);

		const targetColumn = columns.find(col => col.id === overId);

		if (!sourceColumn || !targetColumn) return;

		const draggedLead = sourceColumn.leads.find(lead => lead.id === activeId);
		if (!draggedLead) return;

		const sourceLeads = [...sourceColumn.leads];
		const targetLeads = [...targetColumn.leads];

		// Remove from source column
		sourceLeads.splice(sourceLeads.indexOf(draggedLead), 1);

		// Add to target column
		targetLeads.push(draggedLead);

		const updatedColumns = columns.map(col => {
			if (col.id === sourceColumn.id) {
				return { ...col, leads: sourceLeads };
			}
			if (col.id === targetColumn.id) {
				return { ...col, leads: targetLeads };
			}
			return col;
		});

		setActiveId(null);
		setActiveLead(null);
		updateColumns(updatedColumns);
	};

	const addColumn = () => {
		if (!newColumnTitle.trim()) return;

		const newColumn: KanbanColumnTypes = {
			id: `column-${uuidv4()}`,
			title: newColumnTitle,
			color: newColumnColor,
			leads: [],
		};

		updateColumns([...columns, newColumn]);
		setNewColumnTitle('');
		setNewColumnColor('bg-gray-500');
		setIsAddColumnOpen(false);
	};

	const handleAddCard = (columnId: string) => {
		setCurrentColumnId(columnId);
		setIsEditMode(false);

		// Find the column to get its id for the status
		const column = columns.find((col) => col.id === columnId);

		setCurrentLead({
			id: uuidv4(),
			company: 'COMPANY A',
			personnel: 'Personnel A',
			title: 'Web dev for their corp site',
			addedOn: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
			manager: 'John Brown',
			contractValue: '300,000 USD',
			status: column?.id || '',
		});

		setIsCardDialogOpen(true);
	};

	const handleEditCard = (lead: Lead) => {
		const columnId = columns.find((col) => col.leads.some((l) => l.id === lead.id))?.id || null;

		setCurrentColumnId(columnId);
		setIsEditMode(true);
		setCurrentLead(lead);
		setIsCardDialogOpen(true);
	};

	const handleDeleteCard = (columnId: string, leadId: string) => {
		const newColumns = columns.map((col) => {
			if (col.id === columnId) {
				return {
					...col,
					leads: col.leads.filter((lead) => lead.id !== leadId),
				};
			}
			return col;
		});

		updateColumns(newColumns);
	};

	const saveCard = () => {
		if (!currentColumnId) return;

		if (isEditMode) {
			// Update existing card
			const newColumns = columns.map((col) => {
				const leadIndex = col.leads.findIndex((lead) => lead.id === currentLead.id);
				if (leadIndex !== -1) {
					const newLeads = [...col.leads];
					newLeads[leadIndex] = currentLead;
					return { ...col, leads: newLeads };
				}
				return col;
			});

			updateColumns(newColumns);
		} else {
			// Add new card
			const newColumns = columns.map((col) => {
				if (col.id === currentColumnId) {
					return {
						...col,
						leads: [...col.leads, currentLead],
					};
				}
				return col;
			});

			updateColumns(newColumns);
		}

		setIsCardDialogOpen(false);
	};

	return (
		<div className="p-4">
			{/* <div className="flex items-center justify-between mb-6">
				<Button onClick={() => setIsAddColumnOpen(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Add Column
				</Button>
			</div> */}

			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div className="flex h-full gap-4">
					<SortableContext
						items={columns.map(col => col.id)}
						strategy={horizontalListSortingStrategy}
					>
						{columns.map((column) => (
							<KanbanColumnContainer
								key={column.id}
								column={column}
								onAddCard={handleAddCard}
								onEditCard={handleEditCard}
								onDeleteCard={handleDeleteCard}
							/>
						))}
					</SortableContext>
				</div>
				<DragOverlay>
					{activeId && activeLead ? (
						<KanbanCardItem
							lead={activeLead}
							// ... other props ...
						/>
					) : null}
				</DragOverlay>
			</DndContext>

			{/* Add Column Dialog */}
			<Dialog
				open={isAddColumnOpen}
				onOpenChange={setIsAddColumnOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Column</DialogTitle>
						<DialogDescription>Create a new column for your kanban board.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="column-title">Column Title</Label>
							<Input
								id="column-title"
								value={newColumnTitle}
								onChange={(e) => setNewColumnTitle(e.target.value)}
								placeholder="Enter column title"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="column-color">Column Color</Label>
							<select
								id="column-color"
								value={newColumnColor}
								onChange={(e) => setNewColumnColor(e.target.value)}
								className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
								<option value="bg-blue-500">Blue</option>
								<option value="bg-green-500">Green</option>
								<option value="bg-yellow-500">Yellow</option>
								<option value="bg-red-500">Red</option>
								<option value="bg-purple-500">Purple</option>
								<option value="bg-gray-500">Gray</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddColumnOpen(false)}>
							Cancel
						</Button>
						<Button onClick={addColumn}>Add Column</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add/Edit Card Dialog */}
			<Dialog
				open={isCardDialogOpen}
				onOpenChange={setIsCardDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isEditMode ? 'Edit Card' : 'Add New Card'}</DialogTitle>
						<DialogDescription>{isEditMode ? 'Edit the details of this card.' : 'Add a new card to this column.'}</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="company">Company</Label>
								<Input
									id="company"
									value={currentLead.company}
									onChange={(e) => setCurrentLead({ ...currentLead, company: e.target.value })}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="personnel">Personnel</Label>
								<Input
									id="personnel"
									value={currentLead.personnel}
									onChange={(e) => setCurrentLead({ ...currentLead, personnel: e.target.value })}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={currentLead.title}
								onChange={(e) => setCurrentLead({ ...currentLead, title: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="addedOn">Added On</Label>
								<Input
									id="addedOn"
									value={currentLead.addedOn}
									onChange={(e) => setCurrentLead({ ...currentLead, addedOn: e.target.value })}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="manager">Manager</Label>
								<Input
									id="manager"
									value={currentLead.manager}
									onChange={(e) => setCurrentLead({ ...currentLead, manager: e.target.value })}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="contractValue">Contract Value</Label>
							<Input
								id="contractValue"
								value={currentLead.contractValue}
								onChange={(e) => setCurrentLead({ ...currentLead, contractValue: e.target.value })}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCardDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={saveCard}>{isEditMode ? 'Save Changes' : 'Add Card'}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
