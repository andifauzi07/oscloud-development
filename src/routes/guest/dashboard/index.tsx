import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/guest/dashboard/')({
	component: RouteComponent,
});

type GuestProjects = {
	id: string;
	name: string;
	date: string;
	time: string;
	description: string;
};

export const guestProjects: GuestProjects[] = [
	{
		id: 'user-registration-test',
		name: 'User Registration Dummy Data',
		date: '2024.11.02',
		time: '10.00 ~ 12.00',
		description: 'This task involves inserting dummy user registration data into the database, including names, emails, and passwords, to test the authentication system.',
	},
	{
		id: 'product-listing-test',
		name: 'Product Listing Dummy Data',
		date: '2024.11.03',
		time: '14.00 ~ 16.00',
		description: 'This task requires adding dummy product data, including names, descriptions, prices, and stock levels, to test the e-commerce platform.',
	},
	{
		id: 'order-history-test',
		name: 'Order History Dummy Data',
		date: '2024.11.04',
		time: '09.00 ~ 11.00',
		description: 'Insert dummy order history records into the system, ensuring proper functionality for order tracking, including user IDs, product IDs, and timestamps.',
	},
];

function RouteComponent() {
	return (
		<div className="">
			{/* Header Section */}

			{/* Tabs Section */}
			<Tabs defaultValue="shift">
				<TabsList className="justify-start w-full gap-8 bg-white border-r border-b [&>*]:rounded-none [&>*]:bg-transparent rounded-none h-12 px-4">
					<TabsTrigger
						value="shift"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Shift
					</TabsTrigger>
					<TabsTrigger
						value="timeline"
						className="text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none py-2">
						Available Dates
					</TabsTrigger>
				</TabsList>
				<TabsContent
					className="m-0"
					value="shift">
					<div className="flex flex-row items-center justify-between px-8 py-4 bg-gray-100 border-b border-r">
						<h1 className="py-3">{''}</h1>
					</div>
					<div className="flex flex-row items-center justify-between px-8 py-4 border-r border-b">
						<h1>Shifts</h1>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2">
						<div className="flex flex-col ">
							<div className="px-8 py-4 border-b">
								<h1>Upcoming</h1>
							</div>
							{guestProjects.map((item) => (
								<div className="flex justify-between py-4 pl-8 border-b">
									<h1>{item.name}</h1>
									<div className="flex px-4 justify-center items-center flex-row gap-4 flex-nowrap">
										<h1>{item.date}</h1>
										<h1 className="w-full">{item.time}</h1>
										<Button
											variant="outline"
											className="w-20">
											<Link
												to={'/guest/dashboard/$projectId'}
												params={{ projectId: item.id }}
												className="w-full h-full">
												VIEW
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>

						<div className="flex flex-col bg-gray-100 ">
							<div className="px-8 py-4 border-r border-l border-b">
								<h1>Joined</h1>
							</div>
							{['Project 1', 'Project 2', 'Project 3', 'Project 4'].map((item) => (
								<div className="flex justify-between py-4 pl-8 border-b border-l bort">
									<h1>{item}</h1>
									<div className="flex px-4 justify-center items-center flex-row gap-4 flex-nowrap">
										<h1>2024.11.01</h1>
										<h1 className="w-full">9:00 ~ 18:00</h1>
										<Button
											variant="outline"
											className="w-20">
											<Link
												to={'/guest/dashboard'}
												className="w-full h-full">
												VIEW
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</TabsContent>
				<TabsContent
					className="m-0"
					value="timeline">
					<div className="flex flex-row items-center justify-between px-8 py-4 bg-gray-100 border-r border-b">
						<h1 className="py-3">{''}</h1>
					</div>
					<div className="flex flex-row items-center justify-between py-4 px-8 border-r">
						<h1>Available Date</h1>
						<Button
							variant="outline"
							className="w-20">
							ADD +
						</Button>
					</div>
					<div className="grid grid-cols-1">
						<div className="flex flex-col w-full">
							<div className="px-8 py-4 border-t border-r">
								<h1>Upcoming</h1>
							</div>
							<div className="flex justify-between items-center py-4 px-8 border-r border-t">
								<h1>2024.01.23</h1>
								<h1>ALL DAY</h1>
								<div className="flex flex-row gap-4 flex-nowrap">
									<Link
										to={'/guest/dashboard'}
										// params={{ userId: row.original.id.toString() }}
										className="w-full h-full">
										<Button
											variant="outline"
											className="w-20">
											EDIT
										</Button>
									</Link>
									<Link
										to={'/guest/dashboard'}
										// params={{ userId: row.original.id.toString() }}
										className="w-full h-full">
										<Button
											variant="outline"
											className="w-20">
											DELETE
										</Button>
									</Link>
								</div>
							</div>
							<div className="flex justify-between items-center py-4 px-8 border-r border-t border-b">
								<h1>2024.01.23</h1>
								<h1>9:00 -18:00</h1>
								<div className="flex flex-row gap-4 flex-nowrap">
									<Link
										to={'/guest/dashboard'}
										// params={{ userId: row.original.id.toString() }}
										className="w-full h-full">
										<Button
											variant="outline"
											className="w-20">
											EDIT
										</Button>
									</Link>
									<Link
										to={'/guest/dashboard'}
										// params={{ userId: row.original.id.toString() }}
										className="w-full h-full">
										<Button
											variant="outline"
											className="w-20">
											DELETE
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
