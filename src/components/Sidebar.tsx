import { Link } from '@tanstack/react-router';
import { Plus, Hash, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';
import { useWorkspace, useWorkspaces } from '@/hooks/useWorkspace';
import { useUserData } from '@/hooks/useUserData';
import { CompanyPersonnelLeadsListDataTable } from './companyPersonnelLeadsListDataTable';

type NavItemProps = {
	icon: React.ElementType;
	label: string;
	to?: string;
	isMinimized?: boolean;
	onClick?: () => void;
};

const NavItem = ({ icon: Icon, label, to, isMinimized, onClick }: NavItemProps) => {
	const content = (
		<div
			className="flex items-center gap-2 p-2 rounded-sm cursor-pointer hover:bg-slate-50"
			onClick={onClick}>
			<Icon
				size={16}
				className="self-center"
			/>
			<span className={`text-sm ${isMinimized ? 'hidden' : 'block'}`}>{label}</span>
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

type FeatureItem = {
	icon: React.ElementType;
	label: string;
	to: string;
};

const Logo = () => {
	return (
		<div>
			<div className="flex-none p-1 bg-[#b0bd94]">
				<div className="p-1 bg-[#550a00]"></div>
			</div>
		</div>
	);
};
const LogoBlue = () => {
	return (
		<div>
			<div className="flex-none p-1 bg-blue-900">
				<div className="p-1 bg-white"></div>
			</div>
		</div>
	);
};

const featuresMap: Record<string, FeatureItem[]> = {
	employee: [
		{ icon: Logo, label: 'Employee List', to: '/employee' },
		{ icon: Logo, label: 'Performance', to: '/performance' },
	],
	crm: [
		{ icon: Logo, label: 'Company List', to: '/company' },
		{ icon: Logo, label: 'Personnel List', to: '/features/personnel-list' },
	],
	project: [
		{ icon: Logo, label: 'Project', to: '/projects' },
		{ icon: Logo, label: 'Profit & Loss', to: '/features/ProfitLoss' },
	],
	payroll: [
		{ icon: Logo, label: 'Employee List', to: '/payroll' },
		{ icon: Logo, label: 'Payment List', to: '/payroll' },
	],
	default: [
		{ icon: Logo, label: 'Employee List', to: '/features/personnel-list' },
		{ icon: Logo, label: 'Payment List', to: '/features/company-list' },
	],
};

const Sidebar: React.FC<{ isMinimized: boolean; setIsMinimized: any }> = ({ isMinimized, setIsMinimized }) => {
	const [selectedPackage, setSelectedPackage] = useState<string>('default');
	const [showMoreCategory, setShowMoreCategory] = useState(false);
	const [showMoreDepartment, setShowMoreDepartment] = useState(false);
	const [showMoreFeatures, setShowMoreFeatures] = useState(false);

	const initialFeatureCount = 2;
	const currentFeatures = featuresMap[selectedPackage] || featuresMap.default;
	const hasMoreFeatures = currentFeatures.length > initialFeatureCount;

	// const { workspace_id } = useUserData()
	const workspace_id = 1;
	const { selectedWorkspace, loading: workspacesLoading } = useWorkspace(Number(workspace_id));

	useEffect(() => {
		setShowMoreFeatures(false);
	}, [selectedPackage]);

	// Handler functions remain the same as original
	const handleAddWorkspace = () => console.log('Add workspace clicked');
	const handleAddApp = () => console.log('Add app clicked');
	const handleAddCategory = () => console.log('Add category clicked');
	const handleAddDepartment = () => console.log('Add department clicked');
	const handleAddFeature = () => console.log('Add feature clicked');

	const adminItems = [
		{ icon: Logo, label: 'Employee List', to: '/admin/employee-list' },
		{ icon: Logo, label: 'Performance', to: '/setting/members' },
		{ icon: Logo, label: 'Settings', to: '/setting' },
	];

	const packagedApps = [
		{ id: 'employee', icon: LogoBlue, label: 'Employee', to: '/employee' },
		{ id: 'performance', icon: LogoBlue, label: 'Performance', to: '/performance' },
		{ id: 'crm', icon: LogoBlue, label: 'CRM', to: '/company' },
		{ id: 'project', icon: LogoBlue, label: 'Project', to: '/projects' },
		{ id: 'payroll', icon: LogoBlue, label: 'Payroll', to: '/payroll' },
	];

	const categories = ['All employees', 'Employee Category A', ...(showMoreCategory ? ['UI Designer', 'Full Time', 'Temporary'] : [])];
	const departments = ['All Department', 'Sales Department', ...(showMoreDepartment ? ['HR Department', 'IT Department', 'Finance'] : [])];

	if (workspacesLoading) {
		return (
            <></>
			// <div className="flex items-center justify-center h-screen">
			// 	<div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
			// </div>
		);
	}

	return (
		<div className={`min-h-screen border-r bg-white transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
			<div className="flex flex-row gap-2.5 font-bold text-center border-b">
				<div className={`${isMinimized ? 'mx-auto' : 'mr-4'}`}>
					<div className="flex-none p-3 bg-[#b0bd94]">
						<div className="p-3 bg-[#550a00]"></div>
					</div>
				</div>
				<div className={`flex justify-center items-center transition-opacity duration-300 ${isMinimized ? 'hidden' : 'opacity-100'}`}>
					<img
						src="/logo/osmerge-beta-logo.png"
						alt="os-merge"
						className="w-24"
					/>
				</div>
			</div>

			{/* Workspace Section */}
			<div className="flex flex-col p-4 text-sm border-b">
				<SectionHeader
					label="Workspace"
					onAddClick={handleAddWorkspace}
				/>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Select Workspace" />
					</SelectTrigger>
					<SelectContent className="rounded-none">
						<SelectItem value={selectedWorkspace?.name || 'default'}>{selectedWorkspace?.name || 'default'}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Master (Admin) Section */}
			<div className="flex flex-col justify-center p-4 border-b">
				<SectionHeader label="Master (Admin)" />
				{adminItems.map((item) => (
					<NavItem
						key={item.label}
						{...item}
						isMinimized={isMinimized}
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
					icon={LogoBlue}
					label="Staffing Agency Package"
					isMinimized={isMinimized}
				/>
				<NavItem
					to={'/'}
					icon={LogoBlue}
					label="Other App Name"
					isMinimized={isMinimized}
				/>
				{/* <button className="text-sm text-blue-500 hover:underline">View more</button> */}
			</div>

			{/* Packaged Apps Section */}
			<div className="flex flex-col p-4 border-b">
				<SectionHeader label="Packaged Apps" />
				{packagedApps.map((app) => (
					<NavItem
						key={app.id}
						{...app}
						isMinimized={isMinimized}
						onClick={() => setSelectedPackage(app.id)}
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
					{currentFeatures?.map((feature) => (
						<NavItem
							key={feature.label}
							{...feature}
							isMinimized={isMinimized}
						/>
					))}
				</div>
				{hasMoreFeatures && (
					<button
						onClick={() => setShowMoreFeatures(!showMoreFeatures)}
						className="text-sm text-blue-500 hover:underline">
						{showMoreFeatures ? 'View less' : 'View more'}
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
							isMinimized={isMinimized}
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
				{/* {!showMoreCategory && (
					<button
						onClick={() => setShowMoreCategory(true)}
						className="text-sm text-blue-500 hover:underline">
						View more
					</button>
				)} */}
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
							isMinimized={isMinimized}
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
				{/* {!showMoreDepartment && (
					<button
						onClick={() => setShowMoreDepartment(true)}
						className="text-sm text-blue-500 hover:underline">
						View more
					</button>
				)} */}
			</div>
			<button
				onClick={() => setIsMinimized(!isMinimized)}
				className="mx-auto pb-10 rounded w-full hover:bg-slate-100">
				{isMinimized ? 'CLOSE' : 'OPEN'}
			</button>
		</div>
	);
};

export default Sidebar;
