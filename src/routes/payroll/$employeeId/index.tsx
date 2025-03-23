import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEmployeeProfile, useEmployeeProjects, useEmployeePayments, useUpdatePaymentStatus } from '@/hooks/usePayroll';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoSection, TitleWrapper } from '@/components/wrapperElement';
import { Label } from '@/components/ui/label';
import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Edit } from 'lucide-react';
import { Employee, EmployeeProfile, Payment } from '@/types/payroll';
import { updateEmployee } from '@/store/slices/employeeSlice';

export const Route = createFileRoute('/payroll/$employeeId/')({
	component: RouteComponent,
});

const breakdowncolumns: ColumnDef<any>[] = [
	{
		accessorKey: 'projectName',
		header: () => <h1 className="pl-8">Projects</h1>,
		cell: ({ row }: any) => <h1>{row.original.projectName}</h1>,
	},
	{
		accessorKey: 'startDate',
		header: 'Start',
		cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
	},
	{
		accessorKey: 'endDate',
		header: 'End',
		cell: ({ row }) => (row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy') : 'Ongoing'),
	},
	{
		accessorKey: 'break_hours',
		header: 'Break',
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
	},
	{
		accessorKey: 'hourlyRate',
		header: 'Hourly Rate',
		cell: ({ row }) => `¥${row.original.hourlyRate.toLocaleString()}`,
	},
	{
		accessorKey: 'transportFee',
		header: 'Transport fee',
	},
	//remove the costumeFee because it is not in the response.
	// {
	// 	accessorKey: 'costumeFee',
	// 	header: 'Costume fee',
	// },
	{
		accessorKey: 'totalFee',
		header: 'Total fee',
		cell: ({ row }) => `¥${row.original.totalFee.toLocaleString()}`,
	},
	{
		id: 'actions',
		accessorKey: 'action',
		header: '',
		cell: () => (
			<div className="flex justify-end w-full">
				<Link to="/">
					<Button
						variant="outline"
						className="w-20 border-t-0 border-b-0 border-r-0">
						VIEW
					</Button>
				</Link>
			</div>
		),
	},
];

const columnsEmployee: ColumnDef<any>[] = [
	// remove the image column
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }: any) => (
			<img
				src={row.original.profileimage || 'placeholder.jpg'}
				className="w-16 h-16 border-0 rounded-none"
			/>
		),
	},
	{
		accessorKey: 'employeeId',
		header: 'ID',
		cell: ({ row }: any) => (
			<Input
				enableEmoji={false}
				defaultValue={row.original.employeeId}
				className="w-20 border-0 rounded-none"
				onChange={(e) => {
					// Handle ID change logic here
					console.log('ID changed:', e.target.value);
				}}
			/>
		),
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'category',
		header: 'Employee Category',
	},
	{
		accessorKey: 'department',
		header: 'Department',
	},
	// removed because it is not in the response
	// {
	// 	accessorKey: 'totalPayment',
	// 	header: 'Total Payment',
	// },
	{
		id: 'hourlyRateA',
		header: 'Hourly Rate A',
		cell: ({ row }) => (row.original.rates?.find((rate: any) => rate.type === 'A')?.ratevalue ? `${row.original.rates.find((rate: any) => rate.type === 'A').ratevalue.toLocaleString()}` : `${(0.0).toLocaleString()}`),
	},
	{
		id: 'hourlyRateB',
		header: 'Hourly Rate B',
		cell: ({ row }) => (row.original.rates?.find((rate: any) => rate.type === 'B')?.ratevalue ? `${row.original.rates.find((rate: any) => rate.type === 'B').ratevalue.toLocaleString()}` : `${(0.0).toLocaleString()}`),
	},
	//removed because it is not in the response
	// {
	// 	accessorKey: 'transportFee',
	// 	header: 'Transport Fee',
	// },
	//removed because it is not in the response
	// {
	// 	accessorKey: 'costA',
	// 	header: 'Cost A',
	// },
	//removed because it is not in the response
	// {
	// 	accessorKey: 'costB',
	// 	header: 'Cost B',
	// },
	//removed because it is not in the response
	// {
	// 	accessorKey: 'other',

	// 	header: 'Other',
	// },
];

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

function RouteComponent() {
	const { employeeId } = useParams({ strict: false });
	const { projects, loading: projectsLoading, error: projectsError } = useEmployeeProjects(Number(employeeId));
	const { payments, loading: paymentsLoading, error: paymentsError } = useEmployeePayments(Number(employeeId));
	const { profile, loading: profileLoading, error: profileError } = useEmployeeProfile(Number(employeeId));
	const [newProfile, setNewProfile] = useState<EmployeeProfile | null>(profile);

	const { updatePaymentStatus } = useUpdatePaymentStatus();
	const [editable, setEditable] = useState(false);
	const [updatedPayments, setUpdatedPayments] = useState<Record<number, string>>({});
	const [localPayments, setLocalPayments] = useState(payments);
	useEffect(() => {
		setLocalPayments(payments);
	}, [payments]);
	const [selectValues, setSelectValues] = useState<Record<number, string>>({});
	const [paymentIsEditable, setPaymentIsEditable] = useState(false);
	const [profileIsEditable, setProfileIsEditable] = useState(false);

	const [editedProfile, setEditedProfile] = useState<
		Partial<{
			name: string;
			department: string;
			category: string;
			rates: Array<{ type: string; ratevalue: number }>;
		}>
	>({});
	const currentProfile = useMemo(
		() => ({
			...profile,
			...editedProfile,
		}),
		[profile, editedProfile]
	);
	const handleProfileEdit = (key: string, value: string | number) => {
		setEditedProfile((prev) => {
			if (key.startsWith('rate-')) {
				const rateType = key.split('-')[1];
				const newRates = [...(prev.rates || profile?.rates || [])];
				const existing = newRates.find((r) => r.type === rateType);
				const numericValue = typeof value === 'string' ? Number(value) : value;

				if (existing) {
					existing.ratevalue = numericValue;
				} else {
					newRates.push({ type: rateType, ratevalue: numericValue });
				}
				return { ...prev, rates: newRates };
			}

			return {
				...prev,
				[key]: typeof value === 'string' ? value : value.toString(),
			};
		});
	};
	const handleProfileSave = async () => {
		try {
			const updateData: Partial<EmployeeProfile> = {};

			// Map edited profile data to API format
			if (editedProfile.name) updateData.name = editedProfile.name;
			if (editedProfile.department) updateData.department = editedProfile.department;
			if (editedProfile.category) updateData.category = editedProfile.category;
			if (editedProfile.rates) {
				updateData.rates = editedProfile.rates.map((rate) => ({
					type: rate.type,
					ratevalue: Number(rate.ratevalue),
				}));
			}

			await updateEmployee({
				employeeId: Number(employeeId),
				data: updateData,
				workspaceId: 1, // Replace with dynamic workspace ID if needed
			});

			// Reset editing state
			setEditedProfile({});
			setProfileIsEditable(false);

			// Optional: Refresh profile data
			// dispatch(fetchEmployeeProfile({ workspaceId: 1, employeeId: Number(employeeId) }));
		} catch (error) {
			console.error('Failed to save profile:', error);
			// Handle error (show toast, etc.)
		}
	};
	// const handleImageUpload = async (
	//     e: React.ChangeEvent<HTMLInputElement>
	// ) => {
	//     if (e.target.files?.[0]) {
	//         const file = e.target.files[0];
	//         const formData = new FormData();
	//         formData.append("profileImage", file);

	//         try {
	//             const result = await updateEmployee({
	//                 employeeId: Number(employeeId),
	//                 data: formData,
	//                 workspaceId: 1,
	//             });
	//             // Update local state with new image URL
	//             if (result.profileimage) {
	//                 setEditedProfile((prev) => ({
	//                     ...prev,
	//                     profileimage: result.profileimage,
	//                 }));
	//             }
	//         } catch (error) {
	//             console.error("Failed to upload image:", error);
	//         }
	//     }
	// };
	const handlePaymentSave = async () => {
		try {
			await Promise.all(
				Object.entries(updatedPayments).map(async ([paymentId, status]) => {
					await updatePaymentStatus(Number(paymentId), {
						status,
						// Include details if needed:
						details: payments
							.find((p) => p.paymentId === Number(paymentId))
							?.details.map((d: any) => ({
								detailid: d.detailId,
								hoursworked: d.hoursWorked,
								transportfee: d.transportFee,
							})),
					});
				})
			);
			setUpdatedPayments({});
			setPaymentIsEditable(false);
		} catch (error) {
			console.error('Failed to save payments:', error);
		}
	};

	const handleProfileCancel = () => {
		setProfileIsEditable(false);
	};
	// const handleProfileEdit = (key: string, value: string) => {
	//     // Convert back to original type if needed
	//     const originalValue = profile?.[key as keyof EmployeeProfile];
	//     const parsedValue =
	//         typeof originalValue === "number" ? Number(value) : value;

	//     setProfileEdited((prev) => ({
	//         ...prev,
	//         [key]: parsedValue,
	//     }));
	// };

	const handleStatusChange = (paymentId: number, newStatus: string) => {
		setUpdatedPayments((prev) => ({ ...prev, [paymentId]: newStatus }));
	};
	const handleStatusUpdate = async (paymentId: number, newStatus: string) => {
		try {
			// Optimistic update
			setLocalPayments((prev) => prev.map((p) => (p.paymentId === paymentId ? { ...p, status: newStatus } : p)));

			await updatePaymentStatus(paymentId, { status: newStatus });
		} catch (error) {
			console.error('Failed to update payment status:', error);
			// Rollback on error
			setLocalPayments(payments);
		}
	};

	const handleSaveEdits = useCallback(async () => {
		try {
			await Promise.all(
				Object.entries(updatedPayments).map(async ([paymentId, status]) => {
					await updatePaymentStatus(Number(paymentId), status);
				})
			);
			setSelectValues({});
			setUpdatedPayments({});
			setEditable(false);
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, [updatedPayments, updatePaymentStatus]);

	useEffect(() => {
		if (payments) {
			const selectValues: Record<number, string> = {};
			payments.forEach((payment) => {
				selectValues[payment.paymentId] = payment.status;
			});
			setSelectValues(selectValues);
		}
	}, [payments]);

	const basicInfo = [
		{
			label: 'Employee ID',
			value: currentProfile?.employeeId?.toString() || '-',
			key: 'employeeId',
		},
		{
			label: 'Name',
			value: currentProfile?.name || '-',
			key: 'name',
		},
		{
			label: 'Department',
			value: currentProfile?.department || '-',
			key: 'department',
		},
		{
			label: 'Category',
			value: currentProfile?.category || '-',
			key: 'category',
		},
		...(currentProfile?.rates?.map((rate) => ({
			label: `Hourly Rate ${rate.type}`,
			value: rate.ratevalue.toString(),
			key: `rate-${rate.type}`,
		})) || []),
	] as { label: string; value: string; key: string }[];
	// const basicInfo = [
	//     {
	//         label: `Employee ID",
	//         value: profile?.employeeId?.toString() || "-",
	//         key: "employeeId",
	//     },
	//     {
	//         label: "Name",
	//         value: profile?.name || "-",
	//         key: "name",
	//     },
	//     {
	//         label: "Department",
	//         value: profile?.department || "-",
	//         key: "department",
	//     },
	//     {
	//         label: "Category",
	//         value: profile?.category || "-",
	//         key: "category",
	//     },
	// ] as { label: string; value: string; key: string }[];

	const rateInfo = [
		{
			label: 'Hourly Rates',
			value: profile?.rates?.map((rate) => `${rate.type}: ¥${rate.ratevalue.toLocaleString()}`).join(', ') || '-',
		},
		{
			label: 'Joined Date',
			value: profile?.joinedDate ? format(new Date(profile.joinedDate), 'MMM dd, yyyy') : '-',
		},
	];

	const projectColumns = [
		{ accessorKey: 'projectName', header: 'Project Name' },
		{
			accessorKey: 'startDate',
			header: 'Start Date',
			cell: ({ row }: any) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
		},
		{
			accessorKey: 'endDate',
			header: 'End Date',
			cell: ({ row }: any) => (row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy') : 'Ongoing'),
		},
		{
			accessorKey: 'hourlyRate',
			header: 'Hourly Rate',
			cell: ({ row }: any) => `¥${row.original.hourlyRate.toLocaleString()}`,
		},
		{
			accessorKey: 'totalFee',
			header: 'Total Fee',
			cell: ({ row }: any) => `¥${row.original.totalFee.toLocaleString()}`,
		},
	];

	const paymentColumns: ColumnDef<any>[] = [
		{ accessorKey: 'paymentId', header: 'Payment ID' },
		{
			accessorKey: 'created_at',
			header: 'Date', // changed createdDate by created_at
			cell: ({ row }) => {
				return row.original.createdDate ? format(new Date(row.original.createdDate), 'MMM dd, yyyy') : '-';
			},
		},
		{
			accessorKey: 'totalPayment',
			header: 'Amount',
			cell: ({ row }) => `¥${row.original.totalPayment.toLocaleString()}`,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) =>
				editable ? (
					<Select
						value={selectValues[row.original.paymentId] || row.original.status}
						onValueChange={(value) => handleStatusChange(row.original.paymentId, value)}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Review">Review</SelectItem>
							<SelectItem value="Paid">Paid</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
						</SelectContent>
					</Select>
				) : (
					<p>{row.original.status}</p>
				),
		},
		{
			accessorKey: 'details',
			header: 'Projects',
			cell: ({ row }) => row.original.details?.map((d: any) => d.projectName).join(', ') || '-',
		},
		{
			accessorKey: 'action',
			header: '',
			cell: ({ row }) => (
				<Link
					to="/payroll/$employeeId/$paymentId"
					params={{
						paymentId: row.original.paymentId.toString(),
						employeeId: employeeId!,
					}}>
					<Button
						variant="outline"
						className="w-20">
						Details
					</Button>
				</Link>
			),
		},
	];

	return (
		<div className="flex flex-col flex-1 h-full">
			<Tabs defaultValue="profile">
				<div className="flex items-center justify-between bg-white border-b border-r">
					<TabsList className="justify-start gap-8 pl-5 bg-white [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12">
						<TabsTrigger
							value="profile"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Profile
						</TabsTrigger>
						<TabsTrigger
							value="joinedprojects"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Joined Projects
						</TabsTrigger>
						<TabsTrigger
							value="payments"
							className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
							Payment
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Profile Tab */}
				<TabsContent
					value="profile"
					className="m-0">
					<div className="h-full">
						<div className="flex flex-col">
							<TitleWrapper>
								<h1>{employeeId}</h1>
							</TitleWrapper>
							<div className="border-b">
								<div className="flex justify-end flex-none w-full bg-white">
									{profileIsEditable ? (
										<>
											<Button
												className="w-20 h-10 text-black bg-transparent border-l border-r link"
												onClick={handleProfileSave}>
												SAVE
											</Button>
											<Button
												className="w-20 h-10 text-black bg-transparent border-r link"
												onClick={handleProfileCancel}>
												CANCEL
											</Button>
										</>
									) : (
										<Button
											className="w-20 h-10 text-black bg-transparent border-l border-r link"
											onClick={() => {
												setProfileIsEditable(true);
											}}>
											EDIT
										</Button>
									)}
								</div>
							</div>
						</div>

						{/* Image and list container */}
						<div className="flex h-full">
							{/* Left side - Image section */}
							<div className="w-[30%] flex flex-col border-b">
								<figure className="w-full h-[100%] relative overflow-hidden">
									<img
										className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
										src={profile?.profileimage}
										alt="Profile"
									/>
								</figure>
								<div className="flex flex-col items-center">
									<h4 className="py-3">Edit profile image</h4>
									<p className="pb-3 text-gray-500">PNG, JPEG, (3MG)</p>
									<div>
										<label
											htmlFor="profile_upload"
											className="cursor-pointer bg-[#f2f2f2] w-48 h-12 flex justify-center items-center hover:bg-muted transition">
											UPLOAD
										</label>
										<Input
											id="profile_upload"
											type="file"
											className="hidden"
											enableEmoji={false}
										/>
									</div>
								</div>
							</div>

							{/* Right side - Info sections */}
							<div className="w-[70%] overflow-y-auto">
								<InfoSection
									items={basicInfo.map((item) => ({
										...item,
										value: editedProfile[item.key as keyof typeof editedProfile]?.toString() || item.value,
									}))}
									title="Basic Information"
									isEditing={profileIsEditable}
									onValueChange={handleProfileEdit}
								/>
								<InfoSection
									items={rateInfo}
									title="Contact"
								/>
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Projects Tab */}
				<TabsContent
					className="m-0"
					value="joinedprojects">
					<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white md:w-auto">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								placeholder=""
								className="border rounded-none w-[400px]"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Status</Label>
							<div className="flex">
								<Button
									size="default"
									className="w-full bg-black rounded-none md:w-20">
									Active
								</Button>
								<Button
									size="default"
									variant="outline"
									className="w-full rounded-none md:w-20">
									All
								</Button>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>‎</Label>
							<AdvancedFilterPopover fields={field} />
						</div>
					</div>
					<div className="flex justify-end w-full bg-white border-b border-r">
						<Link
							to="/payroll/$employeeId/joined-projects"
							params={{ employeeId: employeeId! }}>
							<Button
								variant="outline"
								className="w-20 h-full">
								CREATE
							</Button>
						</Link>
					</div>
					<DataTable
						columns={columnsEmployee}
						data={
							profile
								? [
										{
											...profile,
											employeeId: profile.employeeId,
											profileimage: profile.profileimage || '',
										},
									]
								: []
						} // Ensure data is an array
						loading={profileLoading}
					/>
					<TitleWrapper className="border-t-0 border-b-0">
						<h2 className="">Breakdown</h2>
					</TitleWrapper>
					<DataTable
						columns={breakdowncolumns}
						data={projects}
						loading={projectsLoading}
					/>
				</TabsContent>

				{/* Payments Tab */}
				<TabsContent
					className="m-0"
					value="payments">
					<div className="flex flex-row flex-wrap items-center justify-between w-full px-6 py-4 bg-white border-b border-r md:flex-row">
						<div className="flex flex-col space-y-2 bg-white md:w-auto">
							<Label htmlFor="keyword">Keyword</Label>
							<Input
								type="keyword"
								id="keyword"
								placeholder=""
								className="border rounded-none w-[400px]"
							/>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Status</Label>
							<div className="flex">
								<Button
									size="default"
									className="w-full bg-black rounded-none md:w-20">
									Active
								</Button>
								<Button
									size="default"
									variant="outline"
									className="w-full rounded-none md:w-20">
									All
								</Button>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
								<span className="text-gray-500">-</span>
								<Input
									type="date"
									className="w-[150px] border rounded-none"
									enableEmoji={false}
								/>
							</div>
						</div>

						<div className="flex flex-col space-y-2">
							<Label>‎</Label>
							<AdvancedFilterPopover fields={field} />
						</div>
					</div>

					<TitleWrapper>
						<h1>Payment</h1>
					</TitleWrapper>

					<div className="border-b">
						<div className="flex justify-end flex-none w-full bg-white">
							{paymentIsEditable ? (
								<>
									<Button
										className="w-20 h-10 text-black bg-transparent border-l border-r link"
										onClick={handlePaymentSave}>
										SAVE
									</Button>
									<Button
										className="w-20 h-10 text-black bg-transparent border-r link"
										onClick={() => {
											setPaymentIsEditable(false);
										}}>
										CANCEL
									</Button>
								</>
							) : (
								<Button
									className="w-20 h-10 text-black bg-transparent border-l border-r link"
									onClick={() => setPaymentIsEditable(true)}>
									EDIT
								</Button>
							)}
						</div>
					</div>

					<div className="border-t border-b border-r">
						<DataTable
							columns={paymentColumns}
							data={localPayments}
							loading={paymentsLoading}
							isEditable={paymentIsEditable}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
