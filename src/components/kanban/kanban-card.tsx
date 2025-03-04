import type { Lead } from './types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';

interface KanbanCardProps {
	lead: Lead;
	onEdit?: (lead: Lead) => void;
	onDelete?: (leadId: string) => void;
}

export function KanbanCardItem({ lead, onEdit, onDelete }: KanbanCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: lead.id,
		data: {
			type: 'Card',
			lead,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="border rounded-sm p-2 text-xs bg-white mb-4 space-y-4 cursor-move">
			<div className="flex justify-between items-center">
				<div className="flex gap-2">
					<span className="font-bold underline">{lead.company}</span>
					<span>{lead.personnel}</span>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => onEdit?.(lead)}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onDelete?.(lead.id)}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="text-sm font-medium">{lead.title}</div>

			<div className="flex justify-between text-xs">
				<div>
					<div className="text-gray-500">Added on</div>
					<div>{lead.addedOn || '2024.12.12'}</div>
				</div>
				<div className="text-right">
					<div className="text-gray-500">Manager</div>
					<div>{lead.manager || 'John Brown'}</div>
				</div>
			</div>

			<div className="pt-2 border-t">
				<div className="flex justify-between items-center">
					<span className="text-sm">Contract value :</span>
					<span className="font-medium">{lead.contractValue || '300,000 USD'}</span>
				</div>
			</div>
		</div>
	);
}
