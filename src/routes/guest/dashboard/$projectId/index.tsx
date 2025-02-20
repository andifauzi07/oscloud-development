import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/guest/dashboard/$projectId/')({
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
	const { projectId } = Route.useParams();
	const filteredData = guestProjects.filter((item) => item.id === projectId);
	console.log(filteredData);

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-8 py-4 bg-gray-100 border-b border-r">
				<h1 className="py-3">{''}</h1>
			</div>
			<div className="flex flex-row items-center justify-between px-8 py-4 border-r border-b">
				<h1>{filteredData[0].name}</h1>
			</div>

			<div className="px-8 py-4 border-b border-r">
				<div className="flex gap-8">
					<h1>{filteredData[0].date}</h1>
					<h1>{filteredData[0].time}</h1>
				</div>
			</div>
			<div className="flex flex-col gap-4 px-8 py-4 border-b border-r">
				<h1>Description</h1>
				<p>{filteredData[0].description}</p>
			</div>
		</div>
	);
}
