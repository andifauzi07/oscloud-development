import { Link } from '@tanstack/react-router';
import { Users, Plus, Settings, Package, FileText, Hash, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';

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
      className="flex gap-2 p-2 rounded-sm hover:bg-slate-50 cursor-pointer"
      onClick={onClick}
    >
      <Icon size={16} className="self-center" />
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

const featuresMap: Record<string, FeatureItem[]> = {
  crm: [
    { icon: Users, label: 'CRM Contacts', to: '/features/crm-contacts' },
    { icon: FileText, label: 'CRM Analytics', to: '/features/crm-analytics' },
  ],
  project: [
    { icon: Package, label: 'Project Dashboard', to: '/features/project-dashboard' },
    { icon: Settings, label: 'Project Settings', to: '/features/project-settings' },
  ],
  default: [
    { icon: Package, label: 'Company List', to: '/features/companylist' },
    { icon: Users, label: 'Personnel List', to: '/features/personnellist' },
  ],
};

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('default');
  const [showMoreCategory, setShowMoreCategory] = useState(false);
  const [showMoreDepartment, setShowMoreDepartment] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  const initialFeatureCount = 2;
  const currentFeatures = featuresMap[selectedPackage] || featuresMap.default;
  const displayedFeatures = showMoreFeatures ? currentFeatures : currentFeatures.slice(0, initialFeatureCount);
  const hasMoreFeatures = currentFeatures.length > initialFeatureCount;

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
    { icon: Users, label: 'Employee List', to: '/admin/employee-list' },
    { icon: FileText, label: 'Performance', to: '/admin/performance' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ];

  const packagedApps = [
    { id: 'employee', icon: Package, label: 'Employee', to: '/employee' },
    { id: 'performance', icon: Package, label: 'Performance', to: '/performance' },
    { id: 'crm', icon: Package, label: 'CRM', to: '/company' },
    { id: 'project', icon: Package, label: 'Project', to: '/projects' },
  ];

  const categories = ['All employees', 'Employee Category A', ...(showMoreCategory ? ['UI Designer', 'Full Time', 'Temporary'] : [])];
  const departments = ['All Department', 'Sales Department', ...(showMoreDepartment ? ['HR Department', 'IT Department', 'Finance'] : [])];

  return (
    <div className={`h-full overflow-y-auto bg-white border-r transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className="relative flex flex-col pb-10 font-bold text-center border-b pt-14">
        <div className={`transition-opacity duration-300 ${isMinimized ? 'opacity-0' : 'opacity-100'}`}>
          OSMERGE - BETA
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-4 left-2 p-1 hover:bg-slate-100 rounded"
        >
          {isMinimized ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

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
					icon={Package}
					label="Staffing Agency Package"
				/>
				<NavItem
					to={'/'}
					icon={Package}
					label="Other App Name"
				/>
				<button
					className="text-sm text-blue-500 hover:underline">
					View more
				</button>
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
          {displayedFeatures.map((feature) => (
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
            className="text-sm text-blue-500 hover:underline"
          >
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
        {!showMoreCategory && (
          <button
            onClick={() => setShowMoreCategory(true)}
            className="text-sm text-blue-500 hover:underline"
          >
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
        {!showMoreDepartment && (
          <button
            onClick={() => setShowMoreDepartment(true)}
            className="text-sm text-blue-500 hover:underline"
          >
            View more
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;