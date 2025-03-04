import type { KanbanColumnTypes, Lead } from './types';
import { KanbanCardItem } from './kanban-card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanColumnProps {
	column: KanbanColumnTypes;
	onAddCard: (columnId: string) => void;
	onEditCard: (lead: Lead) => void;
	onDeleteCard: (columnId: string, leadId: string) => void;
}

export function KanbanColumnContainer({ column, onAddCard, onEditCard, onDeleteCard }: KanbanColumnProps) {
	const { id, title, color, leads } = column;

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: id,
		data: {
			type: 'Column',
			column,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// Calculate total contract value
	const totalContractValue = leads.reduce((total, lead) => {
		const value = lead.contractValue || '0 USD';
		const numericValue = Number.parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
		return total + numericValue;
	}, 0);

	const formattedTotalValue = totalContractValue.toLocaleString() + ' USD';

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="w-full min-w-[250px] max-w-[300px] flex flex-col">
			<div
				className="flex items-center justify-between mb-2 cursor-move"
				{...attributes}
				{...listeners}>
				<div className="flex items-center gap-2">
					<div className={`w-4 h-4 ${color}`} />
					<h3 className="font-bold">
						{title} ({leads.length})
					</h3>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAddCard(id)}
					className="h-8 w-8">
					<Plus className="h-4 w-4" />
					<span className="sr-only">Add card</span>
				</Button>
			</div>

			<div className="mb-2">
				<div className="flex justify-between items-center">
					<span className="text-sm">Contract value :</span>
					<span className="font-medium">{formattedTotalValue}</span>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{leads.map((lead) => (
					<div
						key={lead.id}
						className="touch-none">
						<KanbanCardItem
							lead={lead}
							onEdit={onEditCard}
							onDelete={(leadId) => onDeleteCard(id, leadId)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
