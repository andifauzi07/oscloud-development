import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronDown, MenuIcon } from 'lucide-react';
import { signOut } from '../backend/auth/auth';

const links = [
	{ name: 'oscloud', path: '/', image: '/logo/oscloud-logo.png' },
	{ name: 'osanalytics', path: '/', image: '/logo/osanalytics-logo.png' },
	{ name: 'osmerge', path: '/dashboard', image: '/logo/osmerge-beta-logo.png' },
	{ name: 'support', path: '/' },
	{ name: 'documentation', path: '/' },
	{ name: 'settings', path: '/dashboard/workspace-member' },
];

const DashboardNavbar = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		navigate({ to: '/auth/signin' });
	};

	return (
		<nav className="border-b border-t h-10 flex flex-col justify-center  z-50 fixed top-0 w-full bg-white flex-none">
			<ul className="flex justify-between">
				<div className="flex">
					{links.map(({ name, path, image }) => (
						<li
							key={name}
							className="px-4 border-l">
							<Link
								className="flex items-center py-2 text-xs text-black hover:text-gray-700"
								to={path}>
								{image ? (
									<img
										src={image}
										alt={name}
										className="h-[20px]"
									/>
								) : (
									<h1 className="text-[13px]">{name}</h1>
								)}
							</Link>
						</li>
					))}
				</div>
				<div className="items-center border-r flex">
					{/* Username Login */}
					<DropdownMenu>
						<DropdownMenuTrigger className="m-0 flex px-4 justify-center items-center border-l h-full">
							<h1 className="w-full text-xs text-black">Username</h1>
						</DropdownMenuTrigger>
						<div className="border-l h-full py-1 px-4 flex items-center">
							JP <ChevronDown size={20} />
						</div>

						<DropdownMenuContent className="px-8 border bg-white py-2 mx-1 border-black">
							<DropdownMenuItem className="border-none cursor-pointer hover:bg-slate-50">
								<Link to="/">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="border-none cursor-pointer hover:bg-slate-50">
								<Link to="/">Security</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="border-none cursor-pointer hover:bg-slate-50"
								onClick={() => handleLogout()}>
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</ul>
		</nav>
	);
};

export default DashboardNavbar;
