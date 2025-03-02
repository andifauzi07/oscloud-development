import React from 'react';

export const TitleWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
	return <div className={`${className} flex justify-between items-center bg-white px-8 flex-none min-h-10 py-2 border-b border-r`}>{children}</div>;
};

export const InfoSection = ({ title, items }: { title: React.ReactNode; items: { label: string; value: string }[] }) => (
	<div className="flex flex-col w-full border-l border-r">
		{title && <h2 className="px-4 py-4 text-sm font-medium bg-gray-100 border-b">{title}</h2>}
		<div className="">
			{items.map((item, index) => (
				<div
					key={index}
					className="flex gap-8 border-b">
					<div className="w-32 px-8 py-3 text-sm font-medium text-gray-600">
						<span>{item?.label}</span>
					</div>
					<div className="flex-1 px-8 py-3 text-sm">
						<span>{item?.value}</span>
					</div>
				</div>
			))}
		</div>
	</div>
);
