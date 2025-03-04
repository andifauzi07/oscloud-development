import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SelectField } from './select-field';

interface AddRecordDialogProps {
	columns: any[];
	onSave: (data: any) => void;
	nonEditableColumns?: string[];
	selectFields?: {
		[key: string]: {
			options: { value: string | number; label: string }[];
		};
	};
}

export function AddRecordDialog({ columns, onSave, nonEditableColumns, selectFields }: AddRecordDialogProps) {
	const [formData, setFormData] = React.useState<Record<string, any>>({});
	const [isOpen, setIsOpen] = React.useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
		setFormData({});
		setIsOpen(false);
	};

	// Helper function to check if a column should be excluded based on wildcard pattern
	const shouldExcludeColumn = (accessorKey: string, pattern: string) => {
		if (pattern.endsWith('*')) {
			const prefix = pattern.slice(0, -1); // Remove the asterisk
			return accessorKey.startsWith(prefix);
		}
		return accessorKey === pattern;
	};

	// Filter out non-editable columns with wildcard support
	const editableColumns = columns.filter((column) => {
		if (!column.accessorKey) return false;

		// Default non-editable columns
		const defaultNonEditable = ['profileimage', 'actions'];
		if (defaultNonEditable.includes(column.accessorKey)) return false;

		// Check custom non-editable columns with wildcard support
		if (nonEditableColumns) {
			return !nonEditableColumns.some((pattern) => shouldExcludeColumn(column.accessorKey, pattern));
		}

		return true;
	});

	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					className="text-black bg-transparent border-l border-r md:w-20 link border-r-none min-h-10"
					variant="ghost">
					ADD+
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[400px] p-4 rounded-none absolute -top-[200px] right-0"
				align="end">
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4">
						<h3 className="font-medium leading-none">Add New Record</h3>
						<div className="grid gap-3">
							{editableColumns.map((column) => {
								const isSelectField = selectFields && selectFields[column.accessorKey];
								return (
									<div
										key={column.accessorKey}
										className="grid gap-2">
										{isSelectField ? (
											<SelectField
												label={column.header}
												options={selectFields[column.accessorKey].options}
												value={formData[column.accessorKey]}
												onChange={(newValue: any) => {
													setFormData((prev) => ({
														...prev,
														[column.accessorKey]: newValue,
													}));
												}}
											/>
										) : (
											<>
												<Label
													htmlFor={column.accessorKey}
													className="text-sm font-medium">
													{column.header}
												</Label>
												<Input
													id={column.accessorKey}
													className={cn('h-8 w-full rounded-none', column.accessorKey === 'name' && 'font-medium')}
													value={formData[column.accessorKey] || ''}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															[column.accessorKey]: e.target.value,
														}))
													}
													placeholder={`...`}
												/>
											</>
										)}
									</div>
								);
							})}
						</div>
						<div className="flex justify-end mt-4">
							<Button
								type="button"
								variant="outline"
								className="w-20 h-8 px-3"
								onClick={() => {
									setIsOpen(false);
									setFormData({});
								}}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="outline"
								className="w-20 h-8 px-3">
								Save
							</Button>
						</div>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	);
}
