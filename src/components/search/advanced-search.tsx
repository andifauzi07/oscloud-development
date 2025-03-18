import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui/select';
import { Label } from '../ui/label';
import { ChevronDown } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useFilter } from '@/hooks/useFilter';
import { useState } from 'react';

export interface FilterField {
	key: string;
	label: string;
	type: string;
	options?: string[];
}

interface AdvancedFilterPopoverProps {
	fields: FilterField[];
}

export default function AdvancedFilterPopover({ fields }: AdvancedFilterPopoverProps) {
	const [open, setOpen] = useState(false);
	const { filter, updateFilter, clearFilter } = useFilter();

	const handleReset = () => {
		clearFilter();
		setOpen((prev) => !prev);
	};

	return (
		<Popover
			onOpenChange={setOpen}
			open={open}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full">
					Advanced Search <ChevronDown />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex flex-row w-auto p-4 mx-4">
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						{fields.map((field, index) =>
							field.options?.length !== undefined && field.type === 'toogle' ? (
								field.options?.length <= 3 ? (
									<div
										key={field.key + String(index)}
										className="flex flex-col gap-2">
										<Label>{field.label}</Label>
										<ToggleGroup
											type="multiple"
											defaultValue={field.options ? [field.options[0]] : []}
											onValueChange={(value) => updateFilter({ [field.key]: value })}>
											{field.options?.map((opt) => (
												<ToggleGroupItem
													key={opt}
													value={opt}>
													{opt}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</div>
								) : (
									<div
										key={field.key + String(index)}
										className="flex flex-col gap-2">
										<Label>{field.label}</Label>
										<Select>
											<SelectTrigger className="w-full border rounded-none">Select a {field.key}</SelectTrigger>
											<SelectContent>
												{field.options?.map((option, index) => (
													<SelectItem
														key={index + String(index)}
														value={option}>
														{option}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)
							) : (
								<div
									key={field.key}
									className="flex flex-col gap-2">
									<Label>{field.label}</Label>
									<Input
										type={field.type}
										name={field.key}
										enableEmoji={field.type === 'number' ? false : true}
										className="border rounded-none"
										onChange={(e) => updateFilter({ [field.key]: e.target.value })}
									/>
								</div>
							)
						)}
					</div>

					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={handleReset}>
							リセット
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
