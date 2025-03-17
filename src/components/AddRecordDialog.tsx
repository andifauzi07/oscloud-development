import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SelectField } from './select-field';
import { CostsDialog } from './CostsDialog';

interface AddRecordDialogProps {
	columns: any[];
	onSave: (data: any) => void;
	nonEditableColumns?: string[];
	selectFields?: {
		[key: string]: {
			options: { value: string | number; label: string }[];
		};
	};
	customFields?: {
		[key: string]: {
			type: 'dateRange';
			startKey: string;
			endKey: string;
			label: string;
		};
	};
	enableCosts?: boolean;
}

export function AddRecordDialog({ columns, onSave, nonEditableColumns = [], selectFields, customFields, enableCosts = false }: AddRecordDialogProps) {
	const [formData, setFormData] = React.useState<Record<string, any>>({});
	const [costs, setCosts] = React.useState<Record<string, number>>({
		food: 0,
		break: 0,
		rental: 0,
		revenue: 0,
		other_cost: 0,
		labour_cost: 0,
		manager_fee: 0,
		costume_cost: 0,
		sales_profit: 0,
		transport_cost: 0,
	});
	const [isOpen, setIsOpen] = React.useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Ensure dates are properly formatted before saving
		const processedData = {
			...formData,
			startdate: formData.startdate || new Date().toISOString().split('T')[0], // Default to today if not set
			enddate: formData.enddate || new Date().toISOString().split('T')[0],  // Default to today if not set
			costs: costs,
		};

		onSave(processedData);
		setIsOpen(false);
		setFormData({});
		setCosts({});
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

		// Skip cost columns if enableCosts is true
		if (enableCosts && column.accessorKey.startsWith('costs.')) return false;

		// Check custom non-editable columns with wildcard support
		if (nonEditableColumns) {
			return !nonEditableColumns.some((pattern) => shouldExcludeColumn(column.accessorKey, pattern));
		}

		return true;
	});

	const handleDateRangeChange = (startKey: string, endKey: string, startDate: string, endDate: string) => {
		setFormData((prev) => ({
			...prev,
			[startKey]: startDate,
			[endKey]: endDate,
		}));
	};

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
				className="w-[400px] -mt-[80px] max-h-[350px] overflow-y-scroll p-4 rounded-none"
				align="center"
				sideOffset={2}>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4">
						<h3 className="font-medium leading-none">Add New Record</h3>
						<div className="grid gap-3">
							{editableColumns.map((column) => {
								const isSelectField = selectFields && selectFields[column.accessorKey];
								const isPartOfCustomField = Object.values(customFields || {}).some((field) => field.startKey === column.accessorKey || field.endKey === column.accessorKey);

								if (isPartOfCustomField) return null;

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
													{/* {typeof column.header === 'function' ? column.header() : column.header} */}
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

							{/* Custom Date Range Fields */}
							{Object.entries(customFields || {}).map(([key, field]) => (
								<div
									key={key}
									className="grid gap-2">
									<Label className="text-sm font-medium">{field.label}</Label>
									<div className="flex items-center gap-2">
										<Input
											enableEmoji={false}
											type="date"
											value={formData[field.startKey] || ''}
											onChange={(e) => handleDateRangeChange(field.startKey, field.endKey, e.target.value, formData[field.endKey])}
											className="w-[150px] border rounded-none"
										/>
										<span className="text-gray-500">-</span>
										<Input
											enableEmoji={false}
											type="date"
											value={formData[field.endKey] || ''}
											onChange={(e) => handleDateRangeChange(field.startKey, field.endKey, formData[field.startKey], e.target.value)}
											className="w-[150px] border rounded-none"
										/>
									</div>
								</div>
							))}

							{/* Add Costs Management */}
							{enableCosts && (
								<div className="grid gap-2">
									<Label className="text-sm font-medium">Project Costs</Label>
									<CostsDialog
										costs={costs}
										onChange={setCosts}
									/>
								</div>
							)}
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
