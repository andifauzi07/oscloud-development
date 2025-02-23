import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui/select';
import { Label } from '../ui/label';
import { ChevronDown } from 'lucide-react';

export default function AdvancedFilterPopover() {
	const options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full">
					Advanced Search <ChevronDown />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex flex-row w-[850px] mx-4 p-4">
				<div className="flex flex-col gap-4">
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-2">
							<Label>Status</Label>
							<div className="flex">
								<Button
									size="default"
									className="w-full rounded-none md:w-20">
									All
								</Button>
								<Button
									size="default"
									variant="outline"
									className="w-full rounded-none md:w-20">
									Active
								</Button>
								<Button
									size="default"
									variant="outline"
									className="w-full rounded-none md:w-20">
									Inactive
								</Button>
							</div>
						</div>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-2">
							<Label>Name</Label>
							<Input
								type="text"
								className="border rounded-none"
							/>
						</div>
						<div className="flex flex-col">
							<Label>Category</Label>
							{options.length > 4 ? (
								<Select>
									<SelectTrigger className="w-full border rounded-none">Dropdown</SelectTrigger>
									<SelectContent>
										{options.map((option, index) => (
											<SelectItem
												key={index}
												value={option}>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<div className="flex flex-row gap-4 p-2 flex-wrap">
									{options.map((option, index) => (
										<Button
											key={index}
											variant={selected === option ? 'default' : 'outline'}
											onClick={() => setSelected(option)}>
											{option}
										</Button>
									))}
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-2">
							<Label>Email</Label>
							<Input
								type="email"
								className="border rounded-none"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>User Id</Label>
							<Input
								type="number"
								className="border rounded-none"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-center">
						<Button className="col-span-2">Search</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
