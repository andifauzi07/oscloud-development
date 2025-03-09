import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { Pie, PieChart, Cell, Text } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, X } from 'lucide-react';
import { mockTemplates, TemplateType, Category, CategoryItem } from '@/config/mockData/templates';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/performance/setting/$templateId/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { templateId } = useParams({ strict: false });
	const [template, setTemplate] = useState<TemplateType | null>(null);
	const [templateName, setTemplateName] = useState('');
	const [newCategory, setNewCategory] = useState('');
	const [newItemName, setNewItemName] = useState('');
	const [isPopoverOpen, setIsPopoverOpen] = useState(true);
	const [editable, setEditable] = useState(false);
	const [isItemPopover, setIsItemPopover] = useState(false);

	useEffect(() => {
		const foundTemplate = mockTemplates.find((t) => t.id === templateId);
		if (foundTemplate) {
			setTemplate(foundTemplate);
			setTemplateName(foundTemplate.name);
		}
	}, [templateId]);

	if (!template) {
		return <div>Template not found</div>;
	}

	const handleNameChange = (value: string) => {
		setTemplateName(value);
	};

	const handleAddCategory = () => {
		if (newCategory.trim() && template) {
			const newCat: Category = {
				id: Date.now().toString(),
				name: newCategory,
				score: 0,
				items: [],
				weight: 0,
				color: '',
			};
			setTemplate({
				...template,
				categories: [...template.categories, newCat],
			});
			setNewCategory('');
			setIsPopoverOpen(false); // Close popover after adding
		}
	};

	const handleDeleteCategory = (id: string) => {
		if (template) {
			setTemplate({
				...template,
				categories: template.categories.filter((cat) => cat.id !== id),
			});
		}
	};

	const handleAddItem = (categoryId: string) => {
		if (!newItemName.trim() || !template) return;

		const newItem: CategoryItem = {
			id: `item${Date.now()}`,
			name: newItemName,
			score: 0,
		};

		setTemplate({
			...template,
			categories: template.categories.map((cat) => (cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat)),
		});
		setNewItemName('');
		setIsItemPopover(false);
	};

	const handleWeightChange = (categoryId: string, weight: number) => {
		if (!template) return;
		setTemplate({
			...template,
			categories: template.categories.map((cat) => (cat.id === categoryId ? { ...cat, weight: Math.max(0, Math.min(100, weight)) } : cat)),
		});
	};

	const handleColorChange = (categoryId: string, color: string) => {
		if (!template) return;
		setTemplate({
			...template,
			categories: template.categories.map((cat) => (cat.id === categoryId ? { ...cat, color } : cat)),
		});
	};

	const handleDeleteItem = (categoryId: string, itemId: string) => {
		if (!template) return;
		setTemplate({
			...template,
			categories: template.categories.map((cat) =>
				cat.id === categoryId
					? {
							...cat,
							items: cat.items.filter((item) => item.id !== itemId),
						}
					: cat
			),
		});
	};

	const handleUpdateItem = (categoryId: string, itemId: string, newName: string) => {
		if (!template) return;
		setTemplate({
			...template,
			categories: template.categories.map((cat) =>
				cat.id === categoryId
					? {
							...cat,
							items: cat.items.map((item) => (item.id === itemId ? { ...item, name: newName } : item)),
						}
					: cat
			),
		});
	};

	const handleUpdateCategoryName = (categoryId: string, newName: string) => {
		if (!template) return;
		setTemplate({
			...template,
			categories: template.categories.map((cat) => (cat.id === categoryId ? { ...cat, name: newName } : cat)),
		});
	};

	const handleSave = () => {
		if (template) {
			const updatedTemplate = {
				...template,
				name: templateName,
			};
			console.log('Saving template:', updatedTemplate);
			// Here you would implement saving to templates.ts
			// This would typically involve an API call in a real application
		}
	};

	const chartData = template.categories.map((category, index) => ({
		name: category.name,
		value: category.score,
		fill: category.color || `hsl(var(--chart-${index + 1}))`,
	}));
	const totalScore = chartData.reduce((sum, item) => sum + item.value, 0);

	const chartConfig = Object.fromEntries(
		template.categories.map(({ name, color }, index) => [
			name,
			{
				label: name,
				color: color || `hsl(var(--chart-${index + 1}))`,
			},
		])
	);

	const RADIAN = Math.PI / 180;
	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);
		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline="central">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div className="flex flex-col h-full overflow-x-hidden">
			<div className="min-h-0">
				<div className="flex flex-row items-center justify-between w-full px-8 bg-white border-r py-4">
					<h1>Setting</h1>
				</div>
				<div className="flex flex-row items-center justify-between px-5 bg-white border-t border-r border-b h-14">
					<Input
						value={templateName}
						onChange={(e) => handleNameChange(e.target.value)}
						className="w-64 py-2 border-0 rounded-none"
						placeholder="Template name"
						enableEmoji={false}
					/>
				</div>
				<div className="flex flex-row items-center justify-end bg-white h-10">
					<div>
						{editable ? (
							<Button
								onClick={() => setEditable((prev) => !prev)}
								className="w-20 text-black bg-transparent border-r border-b link border-r-none h-10"
								variant="default">
								CANCEL
							</Button>
						) : (
							<Popover>
								<PopoverTrigger asChild>
									<Button className="w-36 text-black bg-transparent border-l border-r link border-r-none h-10">NEW CATEGORY+</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80 mr-8">
									<div className="flex flex-col gap-4">
										<Label>Add New Category</Label>
										<Input
											value={newCategory}
											onChange={(e) => setNewCategory(e.target.value)}
											placeholder="Category name"
											className="w-full"
										/>
										<Button
											onClick={handleAddCategory}
											className="w-full">
											Add Category
										</Button>
									</div>
								</PopoverContent>
							</Popover>
						)}

						{editable ? (
							<Button
								onClick={() => setEditable((prev) => !prev)}
								className="w-20 text-black bg-transparent border-r border-b link border-r-none h-10"
								variant="default">
								SAVE
							</Button>
						) : (
							<Button
								onClick={() => setEditable((prev) => !prev)}
								className="w-20 text-black bg-transparent border-r border-b link border-r-none h-10"
								variant="default">
								EDIT
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className="flex-1">
				<div className="grid h-full grid-cols-2">
					<Card className="flex flex-col h-full border-l-0">
						<CardContent className="flex-1">
							<ChartContainer
								config={chartConfig}
								className="w-full h-full min-h-[500px] flex items-center justify-center">
								<PieChart
									width={500}
									height={500}>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={renderCustomizedLabel}
										fill="#8884d8"
										dataKey="value"
										innerRadius={100}
										outerRadius={200}>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.fill}
											/>
										))}
									</Pie>
									<Text
										x={250}
										y={250}
										textAnchor="middle"
										dominantBaseline="middle"
										fontSize={24}
										fontWeight="bold">
										{totalScore}
									</Text>
									<ChartTooltip content={<ChartTooltipContent />} />
								</PieChart>
							</ChartContainer>
						</CardContent>
					</Card>

					<div className="flex flex-col h-full p-0 bg-white">
						<Accordion
							type="single"
							collapsible
							defaultValue={template.categories[0].id}
							className="w-full">
							{template.categories.map((category, index) => (
								<AccordionItem
									key={category.id}
									value={category.id}
									className="border-0 p-0 m-0">
									<div className="flex w-full items-center border-r border-b">
										<div
											className="flex-1"
											style={{
												backgroundColor: category.color || `hsl(var(--chart-${index + 1}))`,
											}}>
											<AccordionTrigger className="w-full p-0 m-0 hover:no-underline">
												<div className="flex items-center justify-between w-full pl-4 py-2">
													{!editable ? (
														<Badge className="rounded-xs text-black bg-white">{category.name}</Badge>
													) : (
														<Input
															enableEmoji={false}
															value={category.name}
															onChange={(e) => handleUpdateCategoryName(category.id, e.target.value)}
															className="w-48 bg-transparent border-0 focus:bg-white/90"
														/>
													)}
													<div className="flex items-center gap-4">
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	variant="outline"
																	disabled={editable ? false : true}
																	className="text-xs underline px-2 w-20 h-8 p-0 border-none"
																	style={{
																		backgroundColor: category.color || `hsl(var(--chart-${index + 1}))`,
																	}}>
																	Color
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-80">
																<div className="flex flex-col gap-4">
																	<Label>Pick a color</Label>
																	<Input
																		type="color"
																		value={category.color || `hsl(var(--chart-${index + 1}))`}
																		onChange={(e) => handleColorChange(category.id, e.target.value)}
																	/>
																</div>
															</PopoverContent>
														</Popover>
														<div className="flex items-center w-full gap-2">
															<Label className="text-xs text-black">Weight</Label>
															{editable ? (
																<Input
																	type="number"
																	disabled={editable ? false : true}
																	className="w-14 h-7 rounded-xs bg-white border-0"
																	value={String(category.weight) || ''}
																	enableEmoji={false}
																	onChange={(e) => handleWeightChange(category.id, Number(e.target.value))}
																/>
															) : (
																<div className="w-14 h-7 rounded-xs bg-white border-0 flex items-center justify-center">{String(category.weight) || ''}</div>
															)}
														</div>
													</div>
												</div>
											</AccordionTrigger>
										</div>
										{!editable ? (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={'outline'}
														className="w-20 h-8 border-none rounded-none hover:text-red-200 hover:bg-transparent">
														NEW +
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-80 mr-8">
													<div className="flex flex-col gap-4">
														<Label>Add New Item</Label>
														<Input
															value={newItemName}
															onChange={(e) => setNewItemName(e.target.value)}
															placeholder="Item name"
															className="w-full"
														/>
														<Button
															onClick={() => handleAddItem(category.id)}
															className="w-full">
															Add Item
														</Button>
													</div>
												</PopoverContent>
											</Popover>
										) : (
											<Button
												variant="outline"
												onClick={(e) => {
													e.preventDefault();
													handleDeleteCategory(category.id);
												}}
												className="w-20 h-8 border-none rounded-none hover:text-red-200 hover:bg-transparent">
												DELETE
											</Button>
										)}
									</div>
									<AccordionContent className="border-b">
										<div className="">
											{category.items.map((item) => (
												<div
													key={item.id}
													className="flex bg-white items-center justify-between border-b border-r">
													{!editable ? (
														<div className="py-1">
															<Badge
																className="rounded-none"
																variant={'secondary'}>
																{item.name}
															</Badge>
														</div>
													) : (
														<div className="flex w-full justify-between">
															<Input
																value={item.name}
																onChange={(e) => handleUpdateItem(category.id, item.id, e.target.value)}
																className="w-full h-8 mr-2 border-none rounded-none"
																enableEmoji={false}
															/>
															<Button
																variant="ghost"
																size="lg"
																onClick={() => handleDeleteItem(category.id, item.id)}
																className="w-20 h-10 border-l rounded-none hover:text-red-700">
																DELETE
															</Button>
														</div>
													)}
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</div>
	);
}
