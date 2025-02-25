import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Project } from './propsTypes';

interface ProjectDetailsDialogProps {
	project: Project | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ProjectDetailsDialog({ project, isOpen, onClose }: ProjectDetailsDialogProps) {
	if (!project) return null;

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">{project.name}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<h3 className="font-medium">Project Details</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="text-muted-foreground">Start Date:</div>
							<div>{format(new Date(project.startDate), 'MMM d, yyyy')}</div>
							<div className="text-muted-foreground">End Date:</div>
							<div>{format(new Date(project.endDate), 'MMM d, yyyy')}</div>
						</div>
					</div>
					<div className="grid gap-2">
						<h3 className="font-medium">Manager</h3>
						<div className="text-sm">{project.manager.name}</div>
					</div>
					<div className="grid gap-2">
						<h3 className="font-medium">Assigned Staff</h3>
						{project.assignedStaff.map((staff) => (
							<div
								key={staff.employeeId}
								className="grid grid-cols-2 gap-2 text-sm">
								<div>{staff.name}</div>
								<div>
									Rate: {staff.rateType} (${staff.rateValue}/hr)
								</div>
							</div>
						))}
					</div>
					<div className="grid gap-2">
						<h3 className="font-medium">Financials</h3>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="text-muted-foreground">Labor Cost:</div>
							<div>${project.financials.totalLabourCost.toLocaleString()}</div>
							<div className="text-muted-foreground">Transport Fee:</div>
							<div>${project.financials.totalTransportFee.toLocaleString()}</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
