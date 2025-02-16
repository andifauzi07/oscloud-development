import AdvancedFilterPopover from '@/components/search/advanced-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEmployees } from '@/config/mockData/employees';
import { mockAssignedStaff, mockPaymentStaff } from '@/config/mockData/projects';
import { createFileRoute } from '@tanstack/react-router';
import { GraphicChart } from '@/components/graphicChart';

export const Route = createFileRoute('/projects/$projectId/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { projectId } = Route.useParams();
	console.log(projectId);

	return (
		<div className="flex flex-col bg-white">
			<div className="px-4 py-4 border">
				<h1>ProjectName</h1>
			</div>

			<Tabs defaultValue="list">
				<TabsList className="justify-start w-full gap-8 bg-white border rounded-none">
					<TabsTrigger
						defaultChecked
						value="description">
						Description
					</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="payment">Payment</TabsTrigger>
					<TabsTrigger value="P/L">P/L</TabsTrigger>
				</TabsList>
				<TabsContent
					defaultChecked
					value="description">
					<div className="flex flex-col border">
						<div className="flex justify-between p-4 border border-t-0">
							<h1>Description</h1>
							<h1>PRINT</h1>
						</div>
						<div className="flex items-center justify-between p-2 bg-gray-100 border">
							<h1>General Information</h1>
							<Button className="border">Edit</Button>
						</div>
						<div className="flex flex-col border [&>*]:p-4">
							<div>
								<Input placeholder="Project Name"></Input>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Client</h1>
								<h1>Company Name</h1>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Personnel</h1>
								<h1>John Brown</h1>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Category</h1>
								<h1>Category A</h1>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Personnel</h1>
								<h1>John Brown</h1>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Personnel</h1>
								<h1>John Brown</h1>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Manager</h1>
								<div className="flex flex-row gap-2">
									<img src="/public/vite.svg" />
									<h1>John Brown</h1>
								</div>
							</div>
							<div className="grid grid-cols-2 border">
								<h1>Required staff number</h1>
								<h1>13</h1>
							</div>
							<div className="flex justify-between bg-gray-100 border">
								<h1>Description</h1>
								<Button className="w-20 text-black bg-transparent border">Edit</Button>
							</div>
							<Input
								className="border"
								placeholder="Bla bla bla bla"></Input>
							<div className="flex items-center justify-between bg-gray-100 border">
								<h1>Assigned staffs</h1>
								<div className="flex flex-row items-center gap-2">
									<h1>2/13</h1>
									<Button className="w-20 text-black bg-transparent border">EDIT</Button>
								</div>
							</div>
							<table className="w-full border border-collapse border-gray-300">
								<thead>
									<tr className="bg-gray-100">
										<th className="p-2 border border-gray-300">ID</th>
										<th className="p-2 border border-gray-300">Name</th>
										<th className="p-2 border border-gray-300">Status</th>
										<th className="p-2 border border-gray-300">Money</th>
										<th className="p-2 border border-gray-300">Money 2</th>
										<th className="p-2 border border-gray-300">Grade</th>
									</tr>
								</thead>
								<tbody>
									{mockAssignedStaff.map((staff) => (
										<tr
											key={staff.id}
											className="text-center">
											<td className="p-2 border border-gray-300">
												<img src={staff.image} />
											</td>
											<td className="p-2 border border-gray-300">{staff.name}</td>
											<td className="p-2 border border-gray-300">{staff.status}</td>
											<td className="p-2 border border-gray-300">${staff.money.toFixed(2)}</td>
											<td className="p-2 border border-gray-300">${staff.money2.toFixed(2)}</td>
											<td className="p-2 border border-gray-300">{staff.grade}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="members">
					<div className="flex items-center p-4 bg-white border">
						<h1>Member adjustment</h1>
					</div>
					<div className="flex flex-row bg-white border">
						<div className="p-4 border min-w-64">
							<div className="flex items-center justify-between">
								<h3>Added</h3>
								<div className="flex items-center gap-2">
									<span>2 / 13</span>
									<Button className="border">EDIT</Button>
								</div>
							</div>
							{/* Added Members List */}
							<div className="flex flex-col gap-2">
								{['John Brown', 'Sarah White'].map((name, index) => (
									<div
										key={index}
										className="flex items-center justify-between">
										<span>{name}</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => console.log('Removing', name)}>
											ASSIGN
										</Button>
									</div>
								))}
							</div>
						</div>
						<div className="w-full">
							<div className="flex items-center p-4 border">
								<h1>Members</h1>
							</div>
							<div className="flex flex-row items-center gap-4 p-4 border">
								<div className="flex flex-col space-y-2">
									<Label htmlFor="keyword">Keyword</Label>
									<Input
										type="text"
										id="keyword"
										placeholder="Search by name, email, etc."
										className="border rounded-none w-[400px]"
									/>
								</div>

								{/* Status Toggle */}
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Status Toggle (tochange) */}
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Advanced Search */}
								<div className="flex flex-col mt-5">
									<AdvancedFilterPopover />
								</div>
							</div>
							<table className="w-full border border-collapse border-gray-300">
								<thead>
									<tr className="bg-gray-100">
										<th className="p-2 border border-gray-300">Profile</th>
										<th className="p-2 border border-gray-300">Name</th>
										<th className="p-2 border border-gray-300">ID</th>
										<th className="p-2 border border-gray-300">Email</th>
										<th className="p-2 border border-gray-300">Category</th>
										<th className="p-2 border border-gray-300">Actions</th>
									</tr>
								</thead>
								<tbody>
									{mockEmployees.map((member) => (
										<tr
											key={member.id}
											className="text-center">
											<td className="p-2 border border-gray-300">
												<img
													src={member.image}
													alt={member.name}
													className="w-8 h-8 rounded-full"
												/>
											</td>
											<td className="p-2 border border-gray-300">{member.name}</td>
											<td className="p-2 border border-gray-300">{member.id}</td>
											<td className="p-2 border border-gray-300">{member.email}</td>
											<td className="p-2 border border-gray-300">{member.category}</td>
											<td className="p-2 border border-gray-300">
												<Button
													variant="outline"
													size="sm">
													Remove
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="payment">
					<div className="flex items-center p-4 bg-white border">
						<h1>Member adjustment</h1>
					</div>
					<div className="flex flex-row bg-white border">
						<div className="w-full">
							<div className="flex flex-row items-center gap-4 p-4 border">
								<div className="flex flex-col space-y-2">
									<Label htmlFor="keyword">Keyword</Label>
									<Input
										type="text"
										id="keyword"
										placeholder="Search by name, email, etc."
										className="border rounded-none w-[400px]"
									/>
								</div>

								{/* Status Toggle */}
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Status Toggle (tochange) */}
								<div className="flex flex-col space-y-2">
									<Label>Status</Label>
									<div className="flex">
										<Button
											size="default"
											className="bg-black rounded-none">
											Active
										</Button>
										<Button
											size="default"
											variant="outline"
											className="rounded-none">
											All
										</Button>
									</div>
								</div>
								{/* Advanced Search */}
								<div className="flex flex-col mt-5">
									<AdvancedFilterPopover />
								</div>
							</div>
							<table className="w-full border border-collapse border-gray-300">
								<thead>
									<tr className="bg-gray-100">
										<th className="p-2 border border-gray-300">Image</th>
										<th className="p-2 border border-gray-300">Name</th>
										<th className="p-2 border border-gray-300">Break</th>
										<th className="p-2 border border-gray-300">Duration</th>
										<th className="p-2 border border-gray-300">Hour rate</th>
										<th className="p-2 border border-gray-300">Transport fee</th>
										<th className="p-2 border border-gray-300">Cost A</th>
										<th className="p-2 border border-gray-300">Cost B</th>
										<th className="p-2 border border-gray-300">Costume fee</th>
										<th className="p-2 border border-gray-300">Total fee</th>
										<th className="p-2 border border-gray-300">Action</th>
									</tr>
								</thead>
								<tbody>
									{mockPaymentStaff.map((payment) => (
										<tr
											key={payment.id}
											className="text-center">
											<td className="p-2 border border-gray-300">
												<img
													src={payment.image}
													alt={payment.name}
													className="w-16 h-16"
												/>
											</td>
											<td className="p-2 border border-gray-300">{payment.name}h</td>
											<td className="p-2 border border-gray-300">{payment.break}h</td>
											<td className="p-2 border border-gray-300">{payment.duration}h</td>
											<td className="p-2 border border-gray-300">{payment.hour_rate}円</td>
											<td className="p-2 border border-gray-300">{payment.transport_fee}円</td>
											<td className="p-2 border border-gray-300">{payment.cost_a}¥</td>
											<td className="p-2 border border-gray-300">{payment.cost_b}¥</td>
											<td className="p-2 border border-gray-300">{payment.costum_fee}¥</td>
											<td className="p-2 border border-gray-300">{payment.cost_a + payment.cost_b}¥</td>
											<td>
												<Button
													variant="outline"
													size="sm">
													Edit
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="P/L">
					<div className="flex items-center p-4 bg-white border">
						<h1>Member adjustment</h1>
					</div>
					<div className="flex flex-row p-4 bg-white border">
						<h1>Profit & Loss</h1>
					</div>

					<div className="flex w-full">
						{/* Left Side */}
						<div className="w-1/3 border-r">
							<div className="items-center flex w-full justify-center bg-gray-100 p-4">
								<h2>Profit</h2>
							</div>
							<div className="flex w-full h-[250px] justify-center items-center border p-4">
								<h2 className="text-2xl">280,000 USD</h2>
							</div>
							<div className="items-center flex w-full justify-center bg-gray-100 p-4">
								<h2>Profitability</h2>
							</div>
							<div className="flex w-full justify-center h-[250px] items-center border p-4">
								<h2 className="text-2xl ">15 %</h2>
							</div>
							<div className="h-[150px]">
								<div className="items-center flex w-full justify-center border bg-gray-100 p-4">
									<h2>Cost Breakdown</h2>
								</div>
								<div className="flex w-full justify-center items-center border p-4">
									<GraphicChart />
								</div>
							</div>
						</div>

						{/* Righ Side */}
						<div className="w-2/3">
							<div className="items-center flex w-full justify-between bg-gray-100 border p-4">
								<h2>Sales Revenue</h2>
								<Button
									variant={'link'}
									className="hover:cursor-pointer">
									EDIT
								</Button>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Revenue Cost</h2>
								<h2>1,000,000 USD</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Other Cost</h2>
								<h2>0 USD</h2>
							</div>
							<div className="items-center flex w-full justify-between bg-gray-100 border p-4">
								<h2>Expenditures</h2>
								<Button
									variant={'link'}
									className="hover:cursor-pointer">
									EDIT
								</Button>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Labour Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Transport Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Costume Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Manager Fee</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Other Cost</h2>
								<h2>10,000 USD</h2>
							</div>
							<div className="items-center flex w-full justify-start bg-gray-100 border p-4">
								<h2>Profit</h2>
							</div>
							<div className="flex gap-2 border-b w-full p-4">
								<h2>Sales Profit</h2>
								<h2>10,000 USD</h2>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
