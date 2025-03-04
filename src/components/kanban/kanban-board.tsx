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
	const [columns, setColumns] = useState<KanbanColumnTypes[]>(initialColumns);
	const [activeColumn, setActiveColumn] = useState<KanbanColumnTypes | null>(null);
	const [activeLead, setActiveLead] = useState<Lead | null>(null);
	const [isUpdatingFromProps, setIsUpdatingFromProps] = useState(false);

	// Dialog states
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');
	const [newColumnColor, setNewColumnColor] = useState('bg-gray-500');
	const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
	const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
	const [currentLead, setCurrentLead] = useState<Lead>({
		id: '',
		company: '',
		personnel: '',
		title: '',
		addedOn: '',
		manager: '',
		contractValue: '',
		status: '',
	});
	const [isEditMode, setIsEditMode] = useState(false);

	// Only update columns from props on initial render or when the structure changes significantly
	useEffect(() => {
		// Deep comparison to check if the columns structure has actually changed
		const columnsChanged =
			JSON.stringify(
				initialColumns.map((col) => ({
					id: col.id,
					title: col.title,
					color: col.color,
					leadsCount: col.leads.length,
				}))
			) !==
			JSON.stringify(
				columns.map((col) => ({
					id: col.id,
					title: col.title,
					color: col.color,
					leadsCount: col.leads.length,
				}))
			);

		if (columnsChanged) {
			setIsUpdatingFromProps(true);
			setColumns(initialColumns);
		}
	}, [initialColumns]);

	// Notify parent component when columns change, but only due to user actions
	const notifyColumnUpdate = useCallback(
		(updatedColumns: KanbanColumnTypes[]) => {
			if (onColumnUpdate && !isUpdatingFromProps) {
				onColumnUpdate(updatedColumns);
			}
		},
		[onColumnUpdate, isUpdatingFromProps]
	);

	// Update columns and notify parent
	const updateColumns = useCallback(
		(newColumns: KanbanColumnTypes[]) => {
			setColumns(newColumns);
			notifyColumnUpdate(newColumns);
		},
		[notifyColumnUpdate]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	);

	const onDragStart = (event: DragStartEvent) => {
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column);
			return;
		}

		if (event.active.data.current?.type === 'Card') {
			setActiveLead(event.active.data.current.lead);
			return;
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setActiveColumn(null);
		setActiveLead(null);

		const { active, over } = event;
		if (!over) return;

		const activeColumnId = active.id;
		const overColumnId = over.id;

		if (activeColumnId === overColumnId) return;

		updateColumns(
			arrayMove(
				columns,
				columns.findIndex((col) => col.id === activeColumnId),
				columns.findIndex((col) => col.id === overColumnId)
			)
		);
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveACard = active.data.current?.type === 'Card';
		const isOverACard = over.data.current?.type === 'Card';

		if (!isActiveACard) return;

		// Dropping a Card over another Card
		if (isActiveACard && isOverACard) {
			const activeLeadData = active.data.current?.lead as Lead;
			const overLeadData = over.data.current?.lead as Lead;

			// Find the columns
			const activeColumn = columns.find((col) => col.leads.some((lead) => lead.id === activeLeadData.id));

			const overColumn = columns.find((col) => col.leads.some((lead) => lead.id === overLeadData.id));

			if (!activeColumn || !overColumn) return;

			// Find the indices
			const activeLeadIndex = activeColumn.leads.findIndex((lead) => lead.id === activeLeadData.id);

			const overLeadIndex = overColumn.leads.findIndex((lead) => lead.id === overLeadData.id);

			// If in the same column
			if (activeColumn.id === overColumn.id) {
				const newLeads = arrayMove(activeColumn.leads, activeLeadIndex, overLeadIndex);

				const newColumns = columns.map((col) => {
					if (col.id === activeColumn.id) {
						return { ...col, leads: newLeads };
					}
					return col;
				});

				updateColumns(newColumns);
			} else {
				// If in different columns
				// Update the status of the lead to match the new column
				const updatedLead = {
					...activeLeadData,
					status: overColumn.id,
				};

				const newColumns = columns.map((col) => {
					// Remove from active column
					if (col.id === activeColumn.id) {
						const newLeads = [...col.leads];
						newLeads.splice(activeLeadIndex, 1);
						return { ...col, leads: newLeads };
					}

					// Add to over column
					if (col.id === overColumn.id) {
						const newLeads = [...col.leads];
						newLeads.splice(overLeadIndex, 0, updatedLead);
						return { ...col, leads: newLeads };
					}

					return col;
				});

				updateColumns(newColumns);
			}
		}

		const isOverAColumn = over.data.current?.type === 'Column';

		// Dropping a Card over a Column
		if (isActiveACard && isOverAColumn) {
			const activeLeadData = active.data.current?.lead as Lead;
			const overColumnId = over.id as string;

			// Find the columns
			const activeColumn = columns.find((col) => col.leads.some((lead) => lead.id === activeLeadData.id));

			const overColumn = columns.find((col) => col.id === overColumnId);

			if (!activeColumn || !overColumn) return;

			// Find the index
			const activeLeadIndex = activeColumn.leads.findIndex((lead) => lead.id === activeLeadData.id);

			// If in the same column
			if (activeColumn.id === overColumn.id) return;

			// Update the status of the lead to match the new column
			const updatedLead = {
				...activeLeadData,
				status: overColumn.id,
			};

			// If in different columns
			const newColumns = columns.map((col) => {
				// Remove from active column
				if (col.id === activeColumn.id) {
					const newLeads = [...col.leads];
					newLeads.splice(activeLeadIndex, 1);
					return { ...col, leads: newLeads };
				}

				// Add to over column
				if (col.id === overColumn.id) {
					return { ...col, leads: [...col.leads, updatedLead] };
				}

				return col;
			});

			updateColumns(newColumns);
		}
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
			{/* <div className="flex justify-between items-center mb-6">
				<Button onClick={() => setIsAddColumnOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Column
				</Button>
			</div> */}

			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}>
				<div className="flex gap-4 pb-4">
					<SortableContext
						items={columns.map((col) => col.id)}
						strategy={horizontalListSortingStrategy}>
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
					{activeColumn && (
						<KanbanColumnContainer
							column={activeColumn}
							onAddCard={handleAddCard}
							onEditCard={handleEditCard}
							onDeleteCard={handleDeleteCard}
						/>
					)}
					{activeLead && <KanbanCardItem lead={activeLead} />}
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
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
