import { Link } from '@tanstack/react-router';
import { Users, Plus, Settings, Package, FileText, Hash, X } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

const NavItem = ({ icon: Icon, label, to }: { icon: any; label: string; to?: string }) => {
	const content = (
		<div className="flex gap-2 p-2 rounded-sm hover:bg-slate-50">
			<Icon
				size={16}
				className="self-center"
			/>
			<span className="text-sm">{label}</span>
		</div>
	);
	return to ? <Link to={to}>{content}</Link> : content;
};

type SectionHeaderProps = {
	label: string;
	showAdd?: boolean;
	onAddClick?: () => void;
};

const SectionHeader = ({ label, showAdd = false, onAddClick }: SectionHeaderProps) => (
	<div className="flex justify-between">
		<span className="mb-2 text-xs text-slate-400">{label}</span>
		{showAdd && (
			<Plus
				size={16}
				className="transition-all cursor-pointer hover:text-slate-400"
				onClick={onAddClick}
			/>
		)}
	</div>
);

const Sidebar = () => {
	const [showMoreCategory, setShowMoreCategory] = useState(false);
	const [showMoreDepartment, setShowMoreDepartment] = useState(false);
	const [showMoreApps, setShowMoreApps] = useState(false);
	const [showMoreFeatures, setShowMoreFeatures] = useState(false);

	const handleAddWorkspace = () => {
		console.log('Add workspace clicked');
	};

	const handleAddApp = () => {
		console.log('Add app clicked');
	};

	const handleAddCategory = () => {
		console.log('Add category clicked');
	};

	const handleAddDepartment = () => {
		console.log('Add department clicked');
	};

	const handleAddFeature = () => {
		console.log('Add feature clicked');
	};

	const adminItems = [
		{ icon: Users, label: 'Employee List', to: '/admin/employee-list' },
		{ icon: FileText, label: 'Performance', to: '/admin/performance' },
		{ icon: Settings, label: 'Settings', to: '/admin/settings' },
	];

	const packagedApps = [
		{ icon: Package, label: 'Employee List', to: '/employee' },
		{ icon: Package, label: 'Performance', to: '/performance' },
		{ icon: Package, label: 'CRM', to: '/company' },
		{ icon: Package, label: 'Project', to: '/projects' },
	];

	const categories = ['All employees', 'Employee Category A', ...(showMoreCategory ? ['UI Designer', 'Full Time', 'Temporary'] : [])];

	const departments = ['All Department', 'Sales Department', ...(showMoreDepartment ? ['HR Department', 'IT Department', 'Finance'] : [])];

	const features = [
		{ icon: Package, label: 'Company List', to: '/features/companylist' },
		{
			icon: Users,
			label: 'Personnel List',
			to: '/features/personnellist',
		},
		...(showMoreFeatures
			? [
					{
						icon: FileText,
						label: 'Advanced Analytics',
						to: '/features/analytics',
					},
					{
						icon: Settings,
						label: 'Custom Reports',
						to: '/features/reports',
					},
				]
			: []),
	];

	return (
		<div className="flex-col w-full h-full overflow-y-auto bg-white border-r">
			<div className="flex flex-col pb-10 font-bold text-center border-b pt-14">OSMERGE - BETA</div>

			{/* Workspace Section */}
			<div className="flex flex-col p-4 text-sm border-b">
				<SectionHeader
					label="Workspace"
					showAdd
					onAddClick={handleAddWorkspace}
				/>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Select Workspace" />
					</SelectTrigger>
					<SelectContent></SelectContent>
				</Select>
			</div>

			{/* Master (Admin) Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader label="Master (Admin)" />
				{adminItems.map((item) => (
					<NavItem
						key={item.label}
						{...item}
					/>
				))}
			</div>

			{/* Apps & Package Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader
					label="Apps & Package"
					showAdd
					onAddClick={handleAddApp}
				/>
				<NavItem
					to={'/'}
					icon={Package}
					label="Staffing Agency Package"
				/>
				<NavItem
					to={'/'}
					icon={Package}
					label="Other App Name"
				/>
				<button
					onClick={() => setShowMoreApps(!showMoreApps)}
					className="text-sm text-blue-500 hover:underline">
					View more
				</button>
			</div>

			{/* Packaged Apps Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader label="Packaged Apps" />
				{packagedApps.map((app) => (
					<NavItem
						key={app.label}
						{...app}
					/>
				))}
			</div>
			{/* Features Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader
					label="Features"
					showAdd
					onAddClick={handleAddFeature}
				/>
				<div className="relative">
					{features.map((feature) => (
						<NavItem
							key={feature.label}
							{...feature}
						/>
					))}
					{showMoreFeatures && (
						<X
							size={16}
							className="absolute top-0 right-0 cursor-pointer hover:text-slate-400"
							onClick={() => setShowMoreFeatures(false)}
						/>
					)}
				</div>
				{!showMoreFeatures && (
					<button
						onClick={() => setShowMoreFeatures(true)}
						className="text-sm text-blue-500 hover:underline">
						View more
					</button>
				)}
			</div>
			{/* Category Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader
					label="Category"
					showAdd
					onAddClick={handleAddCategory}
				/>
				<div className="relative">
					{categories.map((category) => (
						<NavItem
							to={'/'}
							key={category}
							icon={Hash}
							label={category}
						/>
					))}
					{showMoreCategory && (
						<X
							size={16}
							className="absolute top-0 right-0 cursor-pointer hover:text-slate-400"
							onClick={() => setShowMoreCategory(false)}
						/>
					)}
				</div>
				{!showMoreCategory && (
					<button
						onClick={() => setShowMoreCategory(true)}
						className="text-sm text-blue-500 hover:underline">
						View more
					</button>
				)}
			</div>

			{/* Department Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader
					label="Department"
					showAdd
					onAddClick={handleAddDepartment}
				/>
				<div className="relative">
					{departments.map((dept) => (
						<NavItem
							to={'/'}
							key={dept}
							icon={Hash}
							label={dept}
						/>
					))}
					{showMoreDepartment && (
						<X
							size={16}
							className="absolute top-0 right-0 cursor-pointer hover:text-slate-400"
							onClick={() => setShowMoreDepartment(false)}
						/>
					)}
				</div>
				{!showMoreDepartment && (
					<button
						onClick={() => setShowMoreDepartment(true)}
						className="text-sm text-blue-500 hover:underline">
						View more
					</button>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
