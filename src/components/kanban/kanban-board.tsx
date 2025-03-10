import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { KanbanColumnTypes, Lead } from './types';
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
import { useCompanies } from '@/hooks/useCompany';
import { SelectField } from '@/components/select-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Company {
    companyid: number;
    name: string;
}

interface Personnel {
    personnelid: number;
    name: string;
    email: string;
}

interface KanbanBoardProps {
    columns: KanbanColumnTypes[];
    onColumnUpdate: (columns: KanbanColumnTypes[]) => Promise<void>;
    disabled?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    columns: initialColumns,
    onColumnUpdate,
    disabled
}) => {
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
		status: 'Pending'
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

	// Add this to your existing state declarations
	const [isSaving, setIsSaving] = useState(false);

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

		if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id) return;

		const draggedLead = sourceColumn.leads.find(lead => lead.id === activeId);
		if (!draggedLead) return;

		// Create copies of the leads arrays
		const sourceLeads = [...sourceColumn.leads];
		const targetLeads = [...targetColumn.leads];

		// Update the lead's status to match the new column
		const updatedLead = {
			...draggedLead,
			status: targetColumn.title
		};

		// Remove from source column
		sourceLeads.splice(sourceLeads.indexOf(draggedLead), 1);

		// Add to target column
		const validStatuses = ['Active', 'Pending', 'Completed'] as const;
		if (validStatuses.includes(targetColumn.title as any)) {
			targetLeads.push({
				...updatedLead,
				status: targetColumn.title as 'Active' | 'Pending' | 'Completed'
			});
		}

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

		if (!currentCompany || !currentPersonnel) {
			alert("Company or personnel information not found");
			return;
		}

		setCurrentLead({
			id: uuidv4(),
			companyId: currentCompany.companyid,
			company: currentCompany.name,
			personnel: currentPersonnel.email, // Set default personnel
			title: '',
			addedOn: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
			manager: currentCompany.manager?.email || '',
			contractValue: '',
			status: (['Active', 'Pending', 'Completed'].includes(columns.find(col => col.id === columnId)?.title || '') 
				? columns.find(col => col.id === columnId)?.title as 'Active' | 'Pending' | 'Completed' 
				: 'Pending')
		});

		setIsCardDialogOpen(true);
	};

	const handleEditCard = (lead: Lead) => {
		const columnId = columns.find((col) => col.leads.some((l) => l.id === lead.id))?.id || null;
		
		if (!currentCompany) {
			alert("Company information not found");
			return;
		}

		setCurrentLead({
			...lead,
			companyId: currentCompany.companyid,
			company: currentCompany.name
		});
		
		setCurrentColumnId(columnId);
		setIsEditMode(true);
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

	// handleCompanyChange function removed

	const saveCard = async () => {
		if (!currentColumnId || !currentLead) {
			alert("Invalid card data");
			return;
		}

		// Get the current company from the URL
		const currentCompanyId = Number(window.location.pathname.split('/').pop());
		const currentCompany = companies?.find(c => c.companyid === currentCompanyId);

		if (!currentCompany) {
			alert("Company information not found");
			return;
		}

		// Validate required fields
		if (!currentLead.title) {
			alert("Please fill in the Title field");
			return;
		}

		setIsSaving(true);

		try {
			const validStatuses = ['Active', 'Pending', 'Completed'] as const;
			const updatedColumns = columns.map((col) => {
				if (isEditMode) {
					const hasExistingCard = col.leads.some(lead => lead.id === currentLead.id);
					
					if (hasExistingCard) {
						if (col.id !== currentColumnId) {
							return {
								...col,
								leads: col.leads.filter(lead => lead.id !== currentLead.id)
							};
						}
						return {
							...col,
							leads: col.leads.map(lead => 
								lead.id === currentLead.id 
									? { 
										...currentLead,
										status: col.title as 'Active' | 'Pending' | 'Completed',
										companyId: currentCompany.companyid,
										company: currentCompany.name
									}
									: lead
							)
						};
					}
					
					if (col.id === currentColumnId && validStatuses.includes(col.title as any)) {
						return {
							...col,
							leads: [...col.leads, { 
								...currentLead,
								status: col.title as 'Active' | 'Pending' | 'Completed',
								companyId: currentCompany.companyid,
								company: currentCompany.name
							}]
						};
					}
				} else {
					if (col.id === currentColumnId && validStatuses.includes(col.title as any)) {
						return {
							...col,
							leads: [...col.leads, { 
								...currentLead,
								status: col.title as 'Active' | 'Pending' | 'Completed',
								addedOn: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
								companyId: currentCompany.companyid,
								company: currentCompany.name
							}]
						};
					}
				}
				return col;
			});

			await updateColumns(updatedColumns);
			alert(isEditMode ? "Card updated successfully!" : "New card added successfully!");
			setIsCardDialogOpen(false);
			
			// Reset states
			setCurrentLead({
				id: '',
				company: '',
				companyId: undefined,
				personnel: '',
				title: '',
				addedOn: '',
				manager: '',
				contractValue: '',
				status: 'Pending'
			});
			setCurrentColumnId(null);
			setIsEditMode(false);

		} catch (error) {
			console.error("Error saving card:", error);
			alert("Failed to save card. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const { companies } = useCompanies();
	
	// Get current company ID and personnel ID from URL
	const pathSegments = window.location.pathname.split('/');
	const companyIdIndex = pathSegments.indexOf('company') + 1;
	const currentCompanyId = Number(pathSegments[companyIdIndex]);
	const currentPersonnelId = Number(pathSegments[pathSegments.length - 1]);
	
	// Get current company
	const currentCompany = useMemo(() => 
		companies?.find(c => c.companyid === currentCompanyId),
		[companies, currentCompanyId]
	);

	// Get current personnel
	const currentPersonnel = useMemo(() => 
		currentCompany?.personnel?.find(p => p.personnelid === currentPersonnelId),
		[currentCompany, currentPersonnelId]
	);

	// Transform companies data for SelectField
	const companyOptions = useMemo(() => 
		companies?.map(company => ({
			value: company.companyid.toString(),
			label: company.name
		})) || [], 
	[companies]);

	// Transform personnel data for the select
	const personnelOptions = useMemo(() => 
		currentCompany?.personnel?.map((person) => ({
			value: person.personnelid.toString(),
			label: person.name
		})) || [], 
	[currentCompany]);

	const handlePersonnelChange = (value: string) => {
		setCurrentLead(prev => ({
			...prev,
			personnel: value
		}));
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
						<DialogDescription>
							{isEditMode ? 'Edit the details of this card.' : 'Add a new card to this column.'}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>Company</Label>
								<Input
									type="text"
									value={currentLead.company}
									disabled={true}
									className="w-full"
								/>
							</div>
							<div className="grid gap-2">
								<Label>Personnel</Label>
								<Input
									type="text"
									value={currentPersonnel?.name || ''}
									disabled={true}
									className="w-full"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={currentLead.title}
								onChange={(e) => setCurrentLead({ ...currentLead, title: e.target.value })}
								disabled={isSaving}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="addedOn">Added On</Label>
								<Input
									id="addedOn"
									value={currentLead.addedOn}
									onChange={(e) => setCurrentLead({ ...currentLead, addedOn: e.target.value })}
									disabled={isSaving}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="manager">Manager</Label>
								<Input
									id="manager"
									value={currentLead.manager}
									onChange={(e) => setCurrentLead({ ...currentLead, manager: e.target.value })}
									disabled={isSaving}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="contractValue">Contract Value</Label>
							<Input
								id="contractValue"
								value={currentLead.contractValue}
								onChange={(e) => setCurrentLead({ ...currentLead, contractValue: e.target.value })}
								disabled={isSaving}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCardDialogOpen(false)}
							disabled={isSaving}>
							Cancel
						</Button>
						<Button 
							onClick={saveCard}
							disabled={isSaving}
						>
							{isSaving ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
									Saving...
								</div>
							) : (
								isEditMode ? 'Save Changes' : 'Add Card'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
