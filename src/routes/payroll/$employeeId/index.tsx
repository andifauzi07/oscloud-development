import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useCallback, useState } from 'react';
import { useEmployeeProfile, useEmployeeProjects, useEmployeePayments, useUpdatePaymentStatus } from '@/hooks/usePayroll';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoSection, TitleWrapper } from '@/components/wrapperElement';
import { Label } from '@/components/ui/label';
import AdvancedFilterPopover from '@/components/search/advanced-search';

export const Route = createFileRoute('/payroll/$employeeId/')({
	component: RouteComponent,
});

const breakdowncolumns = [
	{
		accessorKey: 'project',
		header: () => <h1 className="pl-8">Projects</h1>,
		cell: ({ row }: any) => <h1>{row.original.project}</h1>,
	},
	{
		accessorKey: 'start',
		header: 'Start',
	},
	{
		accessorKey: 'end',
		header: 'End',
	},
	{
		accessorKey: 'break',
		header: 'Break',
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
	},
	{
		accessorKey: 'hourRate',
		header: 'Houra rate',
	},
	{
		accessorKey: 'transportFee',
		header: 'Transport fee',
	},
	{
		accessorKey: 'costumeFee',
		header: 'Costume fee',
	},
	{
		accessorKey: 'totalFee',
		header: 'Total fee',
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

const columnsEmployee = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }: any) => (
			<img
				src={row.original.image}
				className="w-16 h-16 border-0 rounded-none"
			/>
		),
	},
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }: any) => (
			<Input
				enableEmoji={false}
				defaultValue={row.original.id}
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
		accessorKey: 'employeeCategory',
		header: 'Employee Category',
	},
	{
		accessorKey: 'totalPayment',
		header: 'Total Payment',
	},
	{
		accessorKey: 'hourlyRateA',
		header: 'Hourly Rate A',
	},
	{
		accessorKey: 'hourlyRateB',
		header: 'Hourly Rate B',
	},
	{
		accessorKey: 'transportFee',
		header: 'Transport Fee',
	},
	{
		accessorKey: 'costA',
		header: 'Cost A',
	},
	{
		accessorKey: 'costB',
		header: 'Cost B',
	},
	{
		accessorKey: 'other',
		header: 'Other',
	},
];

function RouteComponent() {
	const { employeeId } = useParams({ strict: false });
	const { profile, loading: profileLoading, error: profileError } = useEmployeeProfile(Number(employeeId));

	console.log(profile);

	const { projects, loading: projectsLoading, error: projectsError } = useEmployeeProjects(Number(employeeId));
	const { payments, loading: paymentsLoading, error: paymentsError } = useEmployeePayments(Number(employeeId));
	const { updatePaymentStatus } = useUpdatePaymentStatus();
	const [editable, setEditable] = useState(false);
	const [updatedPayments, setUpdatedPayments] = useState<Record<number, string>>({});

	const handleStatusChange = (paymentId: number, newStatus: string) => {
		setUpdatedPayments((prev) => ({ ...prev, [paymentId]: newStatus }));
	};

	const handleSaveEdits = useCallback(async () => {
		try {
			await Promise.all(
				Object.entries(updatedPayments).map(async ([paymentId, status]) => {
					await updatePaymentStatus(Number(paymentId), status);
				})
			);
			setUpdatedPayments({});
			setEditable(false);
		} catch (error) {
			console.error('Failed to save updates:', error);
		}
	}, [updatedPayments, updatePaymentStatus]);

	const basicInfo = [
		{
			label: 'Employee ID',
			value: profile?.employeeId?.toString() || '-',
		},
		{
			label: 'Name',
			value: profile?.name || '-',
		},
		{
			label: 'Department',
			value: profile?.department || '-',
		},
		{
			label: 'Category',
			value: profile?.category || '-',
		},
	] as { label: string; value: string }[];

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

	const projectColumns: ColumnDef<any>[] = [
		{ accessorKey: 'projectName', header: 'Project Name' },
		{
			accessorKey: 'startDate',
			header: 'Start Date',
			cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
		},
		{
			accessorKey: 'endDate',
			header: 'End Date',
			cell: ({ row }) => (row.original.endDate ? format(new Date(row.original.endDate), 'MMM dd, yyyy') : 'Ongoing'),
		},
		{
			accessorKey: 'hourlyRate',
			header: 'Hourly Rate',
			cell: ({ row }) => `¥${row.original.hourlyRate.toLocaleString()}`,
		},
		{
			accessorKey: 'totalFee',
			header: 'Total Fee',
			cell: ({ row }) => `¥${row.original.totalFee.toLocaleString()}`,
		},
	];

	const paymentColumns: ColumnDef<any>[] = [
		{ accessorKey: 'paymentId', header: 'Payment ID' },
		{
			accessorKey: 'created_at',
			header: 'Date',
			cell: ({ row }) => format(new Date(row.original.created_at), 'MMM dd, yyyy'),
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
						value={updatedPayments[row.original.paymentId] || row.original.status}
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
									<Button className="w-20 h-10 text-black bg-transparent border-l border-r link">EDIT</Button>
								</div>
							</div>
						</div>

						{/* Scrollable content section */}
						<div className="flex-1 min-h-0">
							{/* Image and list container */}
							<div className="flex">
								{/* Left side - Image section */}
								<div className="w-[30%] flex flex-col border-b">
									<figure className="w-full h-[100%] relative overflow-hidden">
										<img
											className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%]"
											src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
										items={basicInfo}
										title="Basic Information"
									/>
									<InfoSection
										items={rateInfo}
										title="Contact"
									/>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
				{/* <TabsContent value="profile" className="m-0">
                    <div className="h-full p-6">
                        <TitleWrapper>
                            <h1 className="text-2xl font-semibold">
                                {profile?.name}
                            </h1>
                            <div className="flex gap-2">
                                {profile?.category}
                                {profile?.department}
                            </div>
                        </TitleWrapper>

                        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                            <InfoSection
                                title="Basic Information"
                                items={basicInfo}
                            />
                            <InfoSection
                                items={rateInfo}
                                title="Employment Details"
                            />
                        </div>
                    </div>
                </TabsContent> */}

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
							<AdvancedFilterPopover />
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
					{/* <DataTable
							columns={columnsEmployee}
							data={profile}
							loading={profileLoading}
						/> */}
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
					value="payments"
					className="m-0">
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold">Payment History</h2>
							<div className="flex gap-2">
								{editable && <Button onClick={handleSaveEdits}>Save Changes</Button>}
								<Button
									variant={editable ? 'destructive' : 'outline'}
									onClick={() => setEditable(!editable)}>
									{editable ? 'Cancel' : 'Edit Payments'}
								</Button>
							</div>
						</div>

						<div className="p-6 bg-white rounded-lg shadow-sm">
							<DataTable
								columns={paymentColumns}
								data={payments}
								loading={paymentsLoading}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
