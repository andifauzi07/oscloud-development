import { createFileRoute, Link } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AssignedStaff, PaymentStaff } from '@/components/projectAssignedStaffDataTable';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { GraphicChart } from '@/components/graphicChart';
import { TitleWrapper } from '@/components/wrapperElement';
import { useProject } from '@/hooks/useProject';
import { useEffect, useState, useCallback } from 'react';
import { CompanyPersonnelLeadsListDataTable } from '@/components/companyPersonnelLeadsListDataTable';
import { useUserData } from '@/hooks/useUserData';
import { useAvailability } from '@/hooks/useAvailability';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompany";
import { useUsers } from "@/hooks/useUser";
import { useEmployee, useWorkspaceEmployees } from '@/hooks/useEmployee';
import { useMemo } from 'react';
import useDebounce from '@/hooks/useDebounce';
const field = [
	{
		key: 'status',
		label: 'Status',
		type: 'toogle',

		options: ['All', 'Active', 'Inactive'],
	},
	{
		key: 'employeeid',
		label: 'Employee Id',
		type: 'number',
	},
	{
		key: 'email',
		label: 'Email',
		type: 'email',
	},
	{
		key: 'name',
		label: 'Name',
		type: 'text',
	},
	{
		key: 'depertment',
		label: 'Department',
		type: 'text',
	},
];
// Define mock data for AssignedStaff
export const mockAssignedStaff: AssignedStaff[] = [
	{
		id: 1,
		image: '/public/vite.svg',
		name: 'John Doe',
		status: 'Active',
		money: 5000.75,
		money2: 3000.5,
		grade: 'A',
	},

];

export const mockPaymentStaff: PaymentStaff[] = [
	{
		id: '1',
		image: '/public/vite.svg',
		name: 'John Doe',
		break: 30,
		duration: 8.5,
		hour_rate: 20,
		transport_fee: 15,
		cost_a: 50,
		cost_b: 30,
		costum_fee: 10,
		total_fee: 225,
	},

];

// Columns for Assigned Staff
const assignedStaffColumns: ColumnDef<AssignedStaff>[] = [
	{
		accessorKey: 'profileImage',
		header: '',
		cell: ({ row }) => (
			<img
				src={row.original?.profileImage || '/default-avatar.png'}
				alt="Profile"
				className="w-10 h-10 rounded-full"
			/>
		),
	},
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => row.original?.name || '-'
	},
	// {
	// 	accessorKey: 'rateType',
	// 	header: 'Rate Type',
	// 	cell: ({ row }) => row.original?.rateType || '-'
	// },
	// {
	// 	accessorKey: 'rateValue',
	// 	header: 'Rate Value',
	// 	cell: ({ row }) => {
	// 		const rate = row.original?.rateValue;
	// 		if (rate === undefined || rate === null) return '-';
	// 		return `$${Number(rate).toFixed(2)}`;
	// 	},
	// },
	// {
	// 	accessorKey: 'breakHours',
	// 	header: 'Break Hours',
	// 	cell: ({ row }) => {
	// 		const hours = row.original?.breakHours;
	// 		if (hours === undefined || hours === null) return '-';
	// 		return `${Number(hours).toFixed(2)}h`;
	// 	},
	// },
	{
		accessorKey: 'availability',
		header: 'Availability',
		cell: ({ row }) => row.original?.availability || '-'
	},
	{
		accessorKey: 'totalEarnings',
		header: 'Total Earnings',
		cell: ({ row }) => {
			const earnings = row.original?.totalEarnings;
			if (earnings === undefined || earnings === null) return '-';
			return `$${Number(earnings).toFixed(2)}`;
		},
	},
	{
		accessorKey: 'averagePerformance',
		header: 'Performance',
		cell: ({ row }) => {
			const performance = row.original?.averagePerformance;
			if (performance === undefined || performance === null) return 'N/A';
			return `${Number(performance).toFixed(1)}%`;
		},
	},
	// {
	// 	accessorKey: 'currentProjects',
	// 	header: 'Current Projects',
	// 	cell: ({ row }) => row.original?.currentProjects || 0
	// },
	{
		id: 'actions',
		accessorKey: 'employeeId',
		header: '',
		cell: ({ row }) => (
			// <div className="flex justify-end w-full">
			// 	<Button
			// 		variant="outline"
			// 		className="text-xs border-t-0 border-b-0 border-r-0">
			// 		EDIT
			// 	</Button>
			// </div>
            <></>
		),
	},
];

// Add this type at the top of the file
interface EnhancedEmployee {
    employeeid: number;
    name: string;
    email: string;
    profileimage: string | null;
    department: {
        departmentname: string;
    };
    employeeCategory: {
        categoryname: string;
    };
    rates?: {
        type: string;
        value: number;
    }[];
    availability?: string;
    averagePerformance?: number | null;
}

export const Route = createFileRoute('/projects/$projectId/')({
	component: ProjectView,
});

function ProjectView() {
	const { projectId } = Route.useParams();
	const { currentUser } = useUserData();
	
	console.log('Debug - Current User:', currentUser);
	console.log('Debug - Workspace ID:', currentUser?.workspaceid);
	
	const { 
		getProjectById, 
		currentProject, 
		loading, 
        getProjectCategories,
		editProject 
	} = useProject();
	const { 
		addAvailability, 
		updateAvailability: updateAvailabilityDetails 
	} = useAvailability();
	const { companies } = useCompanies();
	const { users } = useUsers();
	const { employees, loading: employeesLoading } = useWorkspaceEmployees();
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState('active');
	const debouncedSearch = useDebounce(searchKeyword, 300) || ''; // Ensure it's never undefined

	// Create enhanced employees data that combines both sources
	const enhancedEmployees = useMemo(() => {
		if (!employees || !Array.isArray(employees)) return [];
		
		return employees.map((employee): EnhancedEmployee => {
			// Find matching assigned staff data if employee is assigned to project
			const assignedStaffData = currentProject?.assignedStaff?.find(
				staff => staff.employeeId === employee.employeeid
			);

			return {
				...employee,
				availability: assignedStaffData?.availability || 'Not Assigned',
				rates: assignedStaffData?.rates || [], // Use rates from assignedStaff
				averagePerformance: assignedStaffData?.averagePerformance
			};
		});
	}, [employees, currentProject?.assignedStaff]);

	// Updated DataTable columns for the members tab
	const getRateValue = (staff: any) => {
		// First try to get rate from the rates array
		if (staff.rates && Array.isArray(staff.rates)) {
			const rateA = staff.rates.find((rate: any) => rate.type === 'A')?.value;
			if (rateA !== undefined) return rateA;
		}
		
		// Fallback to rateValue if rates array is not available
		if (staff.rateValue !== undefined) return staff.rateValue;
		
		return null;
	};

	const memberColumns = [
		{
			accessorKey: 'profileimage',
			header: '',
			cell: ({ row }: any) => (
				<img
					src={row.original.profileimage || '/default-avatar.png'}
					alt="Profile"
					className="w-10 h-10 rounded-full"
				/>
			),
		},
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'department.departmentname',
			header: 'Department',
			cell: ({ row }: any) => row.original.department?.departmentname || 'N/A',
		},
		{
			accessorKey: 'availability',
			header: 'Availability',
			cell: ({ row }: any) => row.original.availability || 'Not Assigned',
		},
		{
			accessorKey: 'rates',
			header: 'Rate',
			cell: ({ row }: any) => {
				const staff = row.original;
				const rateValue = getRateValue(staff);
				
				if (rateValue === null) return 'N/A';
				return `¥${rateValue.toLocaleString()}/hr`;
			},
		},
		{
			accessorKey: 'averagePerformance',
			header: 'Performance',
			cell: ({ row }: any) => {
				const performance = row.original.averagePerformance;
				if (performance === undefined || performance === null) return 'N/A';
				return `${Number(performance).toFixed(1)}%`;
			},
		},
		{
			id: 'actions',
			cell: ({ row }: any) => {
				const isAssigned = currentProject?.assignedStaff?.some(
					staff => staff.employeeId === row.original.employeeid
				);
				
				return (
					<Button
						variant="outline"
						className="w-20 py-2 border rounded-none"
						size="sm"
						disabled={isAssigned}
						onClick={() => handleAssignEmployee(row.original.employeeid)}
					>
						{isAssigned ? 'ASSIGNED' : 'ASSIGN'}
					</Button>
				);
			},
		},
	];

	// Filter employees based on search and status
	const filteredEmployees = useMemo(() => {
		if (!employees || !Array.isArray(employees)) return [];
		
		const searchTerm = (debouncedSearch || '').toLowerCase();
		
		return employees.filter((employee) => {
			if (!employee) return false;
			
			// Safely check if the required properties exist
			const employeeName = String(employee?.name || '');
			const employeeEmail = String(employee?.email || '');

			const matchesSearch = 
				employeeName.toLowerCase().includes(searchTerm) ||
				employeeEmail.toLowerCase().includes(searchTerm);

			// Since there's no explicit status field in your data, you might want to
			// modify this condition based on your needs
			const matchesStatus = statusFilter === 'all' ? true : true; // temporarily always true

			return matchesSearch && matchesStatus;
		});
	}, [employees, debouncedSearch, statusFilter]);

	// Check if employee is already assigned
	const isEmployeeAssigned = (employeeId: number) => {
		return currentProject?.assignedStaff?.some(
			staff => staff.employeeId === employeeId
		);
	};

	// Handle employee assignment
	const handleAssignEmployee = async (employeeId: number) => {
		try {
			if (!projectId || !currentUser?.workspaceid) return;

			const updateData = {
				...currentProject,
				assignedStaff: [...(currentProject?.assignedStaff || []), {
					employeeId,
					projectId: Number(projectId)
				}]
			};

			await editProject({
				workspaceId: currentUser.workspaceid,
				projectId: Number(projectId),
				data: updateData
			});

			await getProjectById(Number(projectId));
			toast.success('Employee assigned successfully');
		} catch (error) {
			console.error('Failed to assign employee:', error);
			toast.error('Failed to assign employee');
		}
	};

	// Handle employee removal
	const handleRemoveEmployee = async (employeeId: string) => {
		try {
			if (!projectId || !currentUser?.workspaceid) return;

			const updateData = {
				...currentProject,
				assignedStaff: currentProject?.assignedStaff?.filter(
					staff => staff.employeeId !== employeeId
				) || []
			};

			await editProject({
				workspaceId: currentUser.workspaceid,
				projectId: Number(projectId),
				data: updateData
			});

			await getProjectById(Number(projectId));
			toast.success('Employee removed successfully');
		} catch (error) {
			console.error('Failed to remove employee:', error);
			toast.error('Failed to remove employee');
		}
	};

	// State management
	const [isEditingGeneral, setIsEditingGeneral] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [categories, setCategories] = useState([]);
	const [editedGeneralInfo, setEditedGeneralInfo] = useState<EditedGeneralInfo>({
		name: currentProject?.name || '',
		companyId: currentProject?.companyid || 0,
		managerId: currentProject?.managerid || '',
		requiredStaffNumber: currentProject?.requiredstaffnumber || 0,
		categoryId: currentProject?.categoryid || null
	});
	const [editedDescription, setEditedDescription] = useState('');
	const [editedData, setEditedData] = useState<Record<string, any>>({});
	const [availabilityModal, setAvailabilityModal] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<any>(null);
	const [editedAvailability, setEditedAvailability] = useState<{
		date: string;
		timeSlot: {
			start: string;
			end: string;
		};
		isNew?: boolean;
	}>({
		date: '',
		timeSlot: {
			start: '',
			end: ''
		}
	});
	const [isEditingStaff, setIsEditingStaff] = useState(false);

	// Add this type conversion function
	const convertAssignedStaffType = (staff: AssignedStaff[]): any[] => {
		return staff.map(s => ({
			id: s.employeeId,
			image: s.profileImage,
			name: s.name,
			status: 'Active',
			money: getRateValue(s) || 0,
			money2: s.totalEarnings || 0,
			grade: s.averagePerformance ? String(s.averagePerformance) : 'N/A'
		}));
	};

	// Initial data fetch
    useEffect(() => {
        if (!projectId || !currentUser?.workspaceid) return;
        getProjectById(Number(projectId));
    }, [projectId, currentUser?.workspaceid, getProjectById]);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!currentUser?.workspaceid) return;
            
            try {
                const categoriesData = await getProjectCategories();
                console.log('Fetched categories:', categoriesData); // Debug log
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Failed to fetch project categories:', error);
                toast.error('Failed to load project categories');
                setCategories([]);
            }
        };

        fetchCategories();
    }, [currentUser?.workspaceid, getProjectCategories]);

   // Effect to update form when currentProject changes
   useEffect(() => {
    if (currentProject) {
        setEditedGeneralInfo({
            name: currentProject.name || '',
            companyId: currentProject.companyid ? Number(currentProject.companyid) : 0,
            managerId: currentProject.managerid || '',
            requiredStaffNumber: currentProject.requiredstaffnumber || 0,
            categoryId: currentProject.categoryid ? Number(currentProject.categoryid) : null
        });
    }
}, [currentProject]);

	// Handlers for General Information
	const handleGeneralInfoEdit = () => {
		if (isEditingGeneral) {
			handleGeneralInfoSave();
		} else {
			setIsEditingGeneral(true);
		}
	};

	// First, define the proper type for editedGeneralInfo
	interface EditedGeneralInfo {
		name: string;
		companyId: number;
		managerId: string;
		requiredStaffNumber: number;
		categoryId: number | null;
	}

	// When saving general info, transform the data to match the API expectations
	const handleGeneralInfoSave = async () => {
		try {
			if (!projectId) {
				throw new Error('Project ID is required');
			}

			// Format the data to match the API expectations
			const updateData = {
				name: editedGeneralInfo.name.trim(),
				companyId: Number(editedGeneralInfo.companyId),
				managerId: editedGeneralInfo.managerId,
				categoryId: editedGeneralInfo.categoryId ? Number(editedGeneralInfo.categoryId) : null,
				requiredStaffNumber: Number(editedGeneralInfo.requiredStaffNumber),
				// Preserve existing values from currentProject
				startDate: currentProject?.startdate || null,
				endDate: currentProject?.enddate || null,
				status: currentProject?.status || 'Active',
				costs: currentProject?.costs || {
					food: 0,
					break: 0,
					rental: 0,
					revenue: 0,
					other_cost: 0,
					labour_cost: 0,
					manager_fee: 0,
					costume_cost: 0,
					sales_profit: 0,
					transport_cost: 0
				}
			};

			console.log('Sending update data:', updateData);

			// Make sure we're passing both workspace ID and project ID
			const result = await editProject({
				workspaceId: currentUser?.workspaceid || 1, // Add workspaceId
				projectId: Number(projectId),
				data: updateData
			});

			console.log('Update result:', result);
			
			// Refresh project data
			await getProjectById(Number(projectId));
			
			setIsEditingGeneral(false);
			toast.success('Project updated successfully');
			
		} catch (error) {
			console.error('Failed to update project:', error);
			toast.error('Failed to update project. Please check all fields are filled correctly.');
		}
	};

	// When setting edited info, maintain consistent casing
	const handleCompanyChange = (value: string) => {
		setEditedGeneralInfo(prev => ({
			...prev,
			companyId: Number(value)
		}));
	};

	// Update the Select components to use consistent casing
	<Select
		value={String(editedGeneralInfo.companyId)}
		onValueChange={handleCompanyChange}
	>
		{/* ... */}
	</Select>

	// Handlers for Description
	const handleDescriptionEdit = () => {
		if (isEditingDescription) {
			handleDescriptionSave();
		} else {
			setIsEditingDescription(true);
		}
	};

	const handleDescriptionSave = async () => {
		try {
			if (!currentProject || !projectId) {
				throw new Error('Project data is not available');
			}

			// Create update payload with all existing data plus new description
			const updatePayload = {
				description: editedDescription,
				name: currentProject.name,
				companyid: currentProject.companyid,
				managerid: currentProject.managerid,
				requiredstaffnumber: currentProject.requiredStaffNumber,
				startdate: currentProject.startdate,
				enddate: currentProject.enddate,
				status: currentProject.status
			};

			console.log('Sending update payload:', updatePayload);

			const result = await editProject({
				projectId: Number(projectId),
				data: updatePayload
			});

			console.log('Update result:', result);

			// Refresh the project data
			await getProjectById(Number(projectId));
			
			setIsEditingDescription(false);
			alert('Description updated successfully');
		} catch (error) {
			console.error('Failed to update description:', error);
			alert('Failed to update description. Please check the console for details.');
		}
	};

	// Handlers for Staff Availability
	const handleStaffAvailabilityEdit = (staff: any) => {
		setSelectedStaff(staff);
		setEditedAvailability({
			date: staff.availability?.date || format(new Date(), 'yyyy-MM-dd'),
			timeSlot: staff.availability?.timeSlot || { start: '09:00', end: '17:00' },
			isNew: !staff.availability
		});
		setAvailabilityModal(true);
	};

	const handleAvailabilitySave = async () => {
		try {
			if (editedAvailability.isNew) {
				await addAvailability({
					employeeId: selectedStaff.id,
					date: editedAvailability.date,
					timeSlot: editedAvailability.timeSlot
				});
			} else {
				await updateAvailabilityDetails(selectedStaff.id, {
					date: editedAvailability.date,
					timeSlot: editedAvailability.timeSlot
				});
			}
			setAvailabilityModal(false);
			await getProjectById(Number(projectId));
			alert('Availability updated successfully');
		} catch (error) {
			console.error('Failed to update availability:', error);
			alert('Failed to update availability');
		}
	};

	const createAssignedStaffColumns = useCallback((isEditing: boolean): ColumnDef<AssignedStaff>[] => [
		{
			accessorKey: 'profileImage',
			header: '',
			cell: ({ row }) => (
				<img
					src={row.original?.profileImage || '/default-avatar.png'}
					alt="Profile"
					className="w-10 h-10 rounded-full"
				/>
			),
		},
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'availability',
			header: 'Availability',
			cell: ({ row }) => {
				if (!isEditing) {
					return <div>{row.getValue('availability') || 'Not set'}</div>;
				}

				return (
					<div className="flex items-center gap-2">
						<Input
							type="date"
							className="w-32"
							value={editedData[row.original.id]?.date || ''}
							onChange={(e) => {
								const timeSlot = editedData[row.original.id]?.timeSlot || { start: '09:00', end: '17:00' };
								setEditedData({
									...editedData,
									[row.original.id]: {
										date: e.target.value,
										timeSlot,
										isNew: !row.getValue('availability')
									}
								});
							}}
						/>
						<Input
							type="time"
							className="w-24"
							value={editedData[row.original.id]?.timeSlot?.start || '09:00'}
							onChange={(e) => {
								const current = editedData[row.original.id] || { date: format(new Date(), 'yyyy-MM-dd'), timeSlot: { end: '17:00' } };
								setEditedData({
									...editedData,
									[row.original.id]: {
										...current,
										timeSlot: { ...current.timeSlot, start: e.target.value },
										isNew: !row.getValue('availability')
									}
								});
							}}
						/>
						<span>-</span>
						<Input
							type="time"
							className="w-24"
							value={editedData[row.original.id]?.timeSlot?.end || '17:00'}
							onChange={(e) => {
								const current = editedData[row.original.id] || { date: format(new Date(), 'yyyy-MM-dd'), timeSlot: { start: '09:00' } };
								setEditedData({
									...editedData,
									[row.original.id]: {
										...current,
										timeSlot: { ...current.timeSlot, end: e.target.value },
										isNew: !row.getValue('availability')
									}
								});
							}}
						/>
					</div>
				);
			},
		},
        {
            accessorKey: 'totalEarnings',
            header: 'Total Earnings',
            cell: ({ row }) => {
                const earnings = row.original?.totalEarnings;
                if (earnings === undefined || earnings === null) return '-';
                return `$${Number(earnings).toFixed(2)}`;
            },
        },
        {
            accessorKey: 'averagePerformance',
            header: 'Performance',
            cell: ({ row }) => {
                const performance = row.original?.averagePerformance;
                if (performance === undefined || performance === null) return 'N/A';
                return `${Number(performance).toFixed(1)}%`;
            },
        },
	], [editedData]);

	if (!currentUser?.workspaceid) {
		return (
			<div className="flex items-center justify-center h-full">
				<p>Loading workspace information...</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<p>Loading project details...</p>
			</div>
		);
	}

	if (!currentProject) {
		return (
			<div className="flex items-center justify-center h-full">
				<p>No project found with ID: {projectId}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-white">
			<TitleWrapper>
				<h1>Project: {currentProject.name}</h1>
			</TitleWrapper>

			<Tabs defaultValue="description">
				<TabsList className="justify-start w-full gap-8 bg-white border-r border-b [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 pl-5">
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="description">
						Description
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="members">
						Members
					</TabsTrigger>
					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="payment">
						Payment
					</TabsTrigger>

					<TabsTrigger
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
						value="P/L">
						P/L
					</TabsTrigger>
				</TabsList>

				{/* Description Tab */}
				<TabsContent
					className="m-0"
					value="description">
					<div className="flex flex-col">
						<div className="flex justify-between border-r">
							<div className="flex items-center h-10 px-8">
								<h1 className="text-sm">Description</h1>
							</div>
							<Button className="w-20 h-10 text-black bg-transparent link">PRINT</Button>
						</div>
						
						{/* General Information Section */}
						<div className="flex items-center justify-between bg-gray-100 border-t border-b border-r">
							<div className="px-8">
								<h1 className="text-base">General Information</h1>
							</div>
							<div className="flex">
								<Button 
									className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
									onClick={() => setIsEditingGeneral(!isEditingGeneral)}
								>
									{isEditingGeneral ? 'CANCEL' : 'EDIT'}
								</Button>
								{isEditingGeneral && (
									<Button 
										className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
										onClick={handleGeneralInfoSave}
									>
										SAVE
									</Button>
								)}
							</div>
						</div>

						<div className="flex flex-col text-xs border-r">
							{/* Project Name */}
							<div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
								<div className="flex justify-start p-2 w-1/8">
									<h1>Project Name</h1>
								</div>
								<div className="flex justify-start flex-1 p-2">
									{isEditingGeneral ? (
										<Input
											value={editedGeneralInfo.name}
											onChange={(e) => setEditedGeneralInfo(prev => ({...prev, name: e.target.value}))}
											className="h-8"
										/>
									) : (
										<h1>{currentProject?.name}</h1>
									)}
								</div>
							</div>

							{/* Client/Company */}
							<div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
								<div className="flex justify-start p-2 w-1/8">
									<h1>Client</h1>
								</div>
								<div className="flex justify-start flex-1 p-2">
									{isEditingGeneral ? (
										<Select
											value={editedGeneralInfo.companyId}
											onValueChange={(value) => setEditedGeneralInfo(prev => ({...prev, companyId: value}))}
										>
											<SelectTrigger className="h-8">
												<SelectValue placeholder="Select company" />
											</SelectTrigger>
											<SelectContent>
												{companies?.map((company) => (
													<SelectItem 
														key={company.companyid} 
														value={String(company.companyid)}
													>
														{company.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<h1>{currentProject?.company?.name}</h1>
									)}
								</div>
							</div>
                            {currentProject?.personnel && currentProject.personnel.length > 0 && (
                            <div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
                                <div className="flex justify-start p-2 w-1/8">
                                    <h1>Personnel</h1>
                                </div>
                                <div className="flex justify-start flex-1 p-2">
                                    <h1>{currentProject.personnel[0].name}</h1>
                                </div>
                            </div>)}

                            {/* Category */}
                            <div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
                                <div className="flex justify-start p-2 w-1/8">
                                    <h1>Category</h1>
                                </div>
                                <div className="flex justify-start flex-1 p-2">
                                    {isEditingGeneral ? (
                                        <Select
                                            value={editedGeneralInfo.categoryId?.toString() || "none"}
                                            onValueChange={(value) => setEditedGeneralInfo(prev => ({
                                                ...prev, 
                                                categoryId: value === "none" ? null : Number(value)
                                            }))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Category</SelectItem>
                                                {categories?.map((category: ProjectCategory) => (
                                                    <SelectItem 
                                                        key={category.categoryid} 
                                                        value={category.categoryid.toString()}
                                                    >
                                                        {category.categoryname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <h1>{currentProject?.category?.categoryname || 'No category assigned'}</h1>
                                    )}
                                </div>
                            </div>

							{/* Manager */}
							<div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
								<div className="flex justify-start p-2 w-1/8">
									<h1>Manager</h1>
								</div>
								<div className="flex justify-start flex-1 p-2">
									{isEditingGeneral ? (
										<Select
											value={editedGeneralInfo.managerId}
											onValueChange={(value) => setEditedGeneralInfo(prev => ({...prev, managerId: value}))}
										>
											<SelectTrigger className="h-8">
												<SelectValue placeholder="Select manager" />
											</SelectTrigger>
											<SelectContent>
												{users?.map((user) => (
													<SelectItem 
														key={user.userid} 
														value={user.userid} // Ensure this matches the UUID format
													>
														{user.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<h1>{currentProject?.manager?.name}</h1>
									)}
								</div>
							</div>

							{/* Required Staff Number */}
							<div className="flex justify-start w-full gap-4 px-6 py-3 border-t">
								<div className="flex justify-start p-2 w-1/8">
									<h1>Required Staff</h1>
								</div>
								<div className="flex justify-start flex-1 p-2">
									{isEditingGeneral ? (
										<Input
											type="number"
											value={editedGeneralInfo.requiredStaffNumber}
											onChange={(e) => setEditedGeneralInfo(prev => ({
												...prev, 
												requiredStaffNumber: parseInt(e.target.value) || 0
											}))}
											className="h-8"
										/>
									) : (
										<h1>{currentProject?.requiredStaffNumber}</h1>
									)}
								</div>
							</div>

							{/* Description Section */}
							<div className="flex items-center justify-between bg-gray-100 border-t border-b">
								<div className="px-8">
									<h1 className="text-base">Description</h1>
								</div>
								<div className="flex">
									<Button 
										className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
										onClick={() => setIsEditingDescription(!isEditingDescription)}
									>
										EDIT
									</Button>
									{isEditingDescription && (
										<Button 
											className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
											onClick={handleDescriptionSave}
										>
											SAVE
										</Button>
									)}
								</div>
							</div>
							<div className="px-8 py-4">
								{isEditingDescription ? (
									<textarea
										value={editedDescription}
										onChange={(e) => setEditedDescription(e.target.value)}
										className="w-full h-32 p-2 border rounded"
									/>
								) : (
									<p>{currentProject?.description || 'No description available'}</p>
								)}
							</div>

							{/* Assigned Staff Section */}
							<div className="flex items-center justify-between bg-gray-100 border-t">
								<div className="px-8">
									<h1>Assigned staffs</h1>
								</div>
								<div className="flex">
									<Button 
										className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
										onClick={() => setIsEditingStaff(!isEditingStaff)}
									>
										EDIT
									</Button>
									{isEditingStaff && (
										<Button 
											className="w-20 h-10 text-black bg-transparent border-l link border-r-none"
											onClick={() => {
												// Add your save logic here
												setIsEditingStaff(false);
											}}
										>
											SAVE
										</Button>
									)}
								</div>
							</div>
						</div>


						<DataTable
							columns={createAssignedStaffColumns(isEditingStaff)}
							data={currentProject?.assignedStaff ? convertAssignedStaffType(currentProject.assignedStaff) : []}
							loading={loading}
						/>
					</div>
				</TabsContent>

				{/* Members Tab */}
				<TabsContent
					className="m-0"
					value="members">
					<TitleWrapper>
						<h1>Member adjustment</h1>
					</TitleWrapper>
					<div className="flex flex-row bg-white">
						<div className="w-1/3 px-8 py-2 border-r">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold">Assigned Members</h3>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">
										{currentProject?.assignedStaff?.length || 0} / {currentProject?.requiredstaffnumber || 0}
									</span>
								</div>
							</div>
							
							{/* Added Members List with more details */}
							<div className="flex flex-col gap-4">
								{currentProject?.assignedStaff?.map((staff) => (
									<div 
										key={staff.employeeId} 
										className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
									>
										<div className="flex items-center gap-3">
											<img
												src={staff.profileImage || '/default-avatar.png'}
												alt={staff.name}
												className="w-10 h-10 rounded-full"
											/>
											<div className="flex flex-col">
												<span className="font-medium">{staff.name}</span>
												<span className="text-sm text-gray-500">
													{staff.rates?.find(rate => rate.type === 'A')?.value 
														? `¥${staff.rates.find(rate => rate.type === 'A')?.value}/hr` 
														: 'No rate set'}
												</span>
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											className="text-red-500 hover:text-red-700 hover:bg-red-50"
											onClick={() => handleRemoveEmployee(staff.employeeId)}
										>
											Remove
										</Button>
									</div>
								))}
								
								{(!currentProject?.assignedStaff || currentProject.assignedStaff.length === 0) && (
									<div className="flex flex-col items-center justify-center py-8 text-gray-500">
										<span className="text-sm">No members assigned yet</span>
									</div>
								)}
							</div>
						</div>

						<div className="w-full">
							<div className="flex items-center p-4 border-b">
								<h1>Available Members</h1>
							</div>

							<div className="flex flex-row flex-wrap items-center justify-between w-full p-4 bg-white border-b md:flex-row">
								<div className="flex flex-col space-y-2 bg-white md:w-auto">
									<Label htmlFor="keyword">Keyword</Label>
									<Input
										type="text"
										id="keyword"
										value={searchKeyword}
										onChange={(e) => setSearchKeyword(e.target.value)}
										placeholder="Search by name, email, etc."
										className="border rounded-none w-[250px]"
									/>
								</div>

								<div className="flex flex-row gap-2">
									<div className="flex flex-col space-y-2">
										<Label>Status</Label>
										<div className="flex">
											<Button
												size="default"
												className={`w-20 rounded-none ${statusFilter === 'active' ? 'bg-black' : ''}`}
												onClick={() => setStatusFilter('active')}
											>
												Active
											</Button>
											<Button
												size="default"
												variant="outline"
												className={`w-20 rounded-none ${statusFilter === 'all' ? 'bg-black text-white' : ''}`}
												onClick={() => setStatusFilter('all')}
											>
												All
											</Button>
										</div>
									</div>
									<div className="flex flex-col space-y-2">
										<Label>‎</Label>
										<AdvancedFilterPopover fields={field} />
									</div>
								</div>
							</div>
							<div className="border-l">
								<DataTable
									columns={memberColumns}
									data={enhancedEmployees}
									loading={loading || employeesLoading}
								/>
							</div>
						</div>
					</div>
				</TabsContent>

			</Tabs>

			{/* Staff Availability Modal */}
			<Dialog open={availabilityModal} onOpenChange={setAvailabilityModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Staff Availability</DialogTitle>
						<DialogDescription>
							Update availability for {selectedStaff?.name}
						</DialogDescription>
					</DialogHeader>
					
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label>Date</Label>
							<Input
								type="date"
								value={editedAvailability.date}
								onChange={(e) => setEditedAvailability(prev => ({
									...prev,
									date: e.target.value
								}))}
							/>
						</div>
						
						<div className="flex gap-4">
							<div className="flex flex-col flex-1 gap-2">
								<Label>Start Time</Label>
								<Input
									type="time"
									value={editedAvailability.timeSlot.start}
									onChange={(e) => setEditedAvailability(prev => ({
										...prev,
										timeSlot: {
											...prev.timeSlot,
											start: e.target.value
										}
									}))}
								/>
							</div>
							
							<div className="flex flex-col flex-1 gap-2">
								<Label>End Time</Label>
								<Input
									type="time"
									value={editedAvailability.timeSlot.end}
									onChange={(e) => setEditedAvailability(prev => ({
										...prev,
										timeSlot: {
											...prev.timeSlot,
											end: e.target.value
										}
									}))}
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setAvailabilityModal(false)}>
							Cancel
						</Button>
						<Button onClick={handleAvailabilitySave}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
