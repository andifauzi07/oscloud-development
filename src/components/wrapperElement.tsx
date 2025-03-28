import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

export const TitleWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
	return <div className={`${className} flex justify-between items-center bg-white px-8 flex-none min-h-10 py-2 border-b border-r`}>{children}</div>;
};

interface InfoSectionProps {
	className?: string;
	title: React.ReactNode;
	items: {
		label: string;
		value: string;
		key?: string;
		type?: string;
		options?: { value: string; label: string }[];
		nonEditable?: boolean;
	}[];
	isEditing?: boolean;
	onValueChange?: (key: string, value: string) => void;
	nonEditableFields?: string[];
}

export const InfoSection: React.FC<InfoSectionProps> = ({ className, title, items, isEditing, onValueChange, nonEditableFields = [] }) => (
	<div className={`flex flex-col border-l ${className}`}>
		<h2 className="px-8 py-2 text-sm font-medium bg-gray-100 border-b border-r">{title}</h2>
		<div className="bg-white">
			{items.map((item, index) => {
				const isFieldEditable = isEditing && item.key && onValueChange && !nonEditableFields.includes(item.key) && !item.nonEditable;

				return (
					<div
						key={index}
						className="flex gap-8 border-b border-r">
						<div className="w-48 px-8 py-2 text-sm font-medium text-gray-600 bg-white">
							<span>{item.label}</span>
						</div>
						<div className="flex-1 px-8 py-2 text-sm bg-white">
							{isFieldEditable ? (
								item.options ? (
									<Select
										value={item.value}
										onValueChange={(value) => onValueChange(item.key!, value)}>
										<SelectTrigger>
											<SelectValue placeholder={`Select ${item.label}`} />
										</SelectTrigger>
										<SelectContent>
											{item.options.map((option) => (
												<SelectItem
													key={option.value}
													value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								) : (
									<Input
										value={item.value}
										onChange={(e) => onValueChange(item.key!, e.target.value)}
										className="h-8"
										enableEmoji={!(item.type === 'number' || item.type === 'email' || item.type === 'boolean')}
									/>
								)
							) : (
								<span>{item.value}</span>
							)}
						</div>
					</div>
				);
			})}
		</div>
	</div>
);
