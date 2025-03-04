import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

// KanbanBoard Component
export const KanbanBoard = ({ children, addBoard }: any) => {
	return (
		<div className="flex flex-col gap-4 p-4 overflow-x-auto md:flex-row">
			{children}
			<Button
				onClick={addBoard}
				className="flex-shrink-0 w-12 h-12">
				<Plus size={16} />
			</Button>
		</div>
	);
};

// KanbanColumn Component
export const KanbanColumn = ({ id, title, color, children, renameBoard, addItem, totalContractValue }: any) => {
	const [newColor, setNewColor] = useState(color);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id,
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
			className="flex-1 p-4 bg-gray-100 rounded-lg min-w-[250px] max-w-full">
			<div className="flex items-center gap-2 mb-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="w-8 h-8 p-2 border-2 border-white/50"
							style={{ backgroundColor: newColor }}
						/>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="flex flex-col gap-4">
							<Label>Pick a color</Label>
							<Input
								type="color"
								value={newColor}
								onChange={(e) => setNewColor(e.target.value)}
							/>
						</div>
					</PopoverContent>
				</Popover>
				<Input
					type="text"
					value={title}
					onChange={(e) => renameBoard(id, e.target.value)}
					className="flex-1"
				/>
				<Button onClick={() => addItem(id)}>
					<Plus size={16} />
				</Button>
			</div>
			<div className="w-full h-[1px] bg-black" />
			<div className="ml-2">Contract value: {totalContractValue}</div>
			<div className="mt-2">{children}</div>
		</div>
	);
};

// KanbanCard Component
export const KanbanCard = ({ id, companyName, personnelName, projectName, startDate, manager, contractValue }: any) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id,
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
			className="p-4 mb-2 text-xs bg-white border border-gray-200 shadow-sm">
			<p className="text-sm font-semibold">{companyName}</p>
			<p>{personnelName}</p>
			<p className="text-xs text-gray-500">{projectName}</p>
			<div className="flex justify-between mt-2">
				<p>{startDate}</p>
				<p>{manager}</p>
			</div>
			<div className="w-full h-[1px] bg-black my-2" />
			<div className="flex items-center justify-between">
				<p>Contract Value:</p>
				<p className="mt-2 font-semibold">{contractValue}</p>
			</div>
		</div>
	);
};

// Main App Component
export const App = () => {
	const [boards, setBoards] = useState([
		{
			id: 'board-1',
			title: 'To Do',
			color: '#FF6B6B',
			items: [
				{
					id: 1,
					companyName: 'Company A',
					personnelName: 'John Doe',
					projectName: 'Project X',
					startDate: '2023-10-01',
					manager: 'Alice',
					contractValue: '$10,000',
				},
			],
		},
	]);

	const addBoard = () => {
		const newBoard = {
			id: `board-${boards.length + 1}`,
			title: `Board ${boards.length + 1}`,
			color: '#FF6B6B',
			items: [],
		};
		setBoards([...boards, newBoard]);
	};

	const renameBoard = (id: any, newTitle: any) => {
		setBoards((prev) => prev.map((board) => (board.id === id ? { ...board, title: newTitle } : board)));
	};

	const addItem = (boardId: any) => {
		const newItem = {
			id: Date.now(),
			companyName: 'New Company',
			personnelName: 'New Personnel',
			projectName: 'New Project',
			startDate: '2023-10-01',
			manager: 'New Manager',
			contractValue: '$0',
		};
		setBoards((prev) => prev.map((board) => (board.id === boardId ? { ...board, items: [...board.items, newItem] } : board)));
	};

	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

	const onDragEnd = (event: any) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			setBoards((prev) => {
				const activeIndex = prev.findIndex((board) => board.id === active.id);
				const overIndex = prev.findIndex((board) => board.id === over.id);
				const newBoards = [...prev];
				newBoards.splice(overIndex, 0, newBoards.splice(activeIndex, 1)[0]);
				return newBoards;
			});
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={onDragEnd}
			modifiers={[restrictToHorizontalAxis]}>
			<SortableContext
				items={boards.map((board) => board.id)}
				strategy={horizontalListSortingStrategy}>
				<KanbanBoard addBoard={addBoard}>
					{boards.map((board) => (
						<KanbanColumn
							key={board.id}
							id={board.id}
							title={board.title}
							color={board.color}
							renameBoard={renameBoard}
							addItem={addItem}
							totalContractValue={board.items.reduce((sum, item) => sum + parseFloat(item.contractValue.replace('$', '').replace(',', '')), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}>
							{board.items.map((item) => (
								<KanbanCard
									key={item.id}
									{...item}
								/>
							))}
						</KanbanColumn>
					))}
				</KanbanBoard>
			</SortableContext>
		</DndContext>
	);
};
