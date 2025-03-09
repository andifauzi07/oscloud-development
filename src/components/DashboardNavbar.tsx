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
		<nav className="fixed top-0 z-50 flex flex-col justify-center flex-none w-full h-10 bg-white border-t border-b">
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
				<div className="flex items-center border-r">
					{/* Username Login */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center justify-center h-full px-4 m-0 border-l">
							<h1 className="w-full text-xs text-black">Username</h1>
						</DropdownMenuTrigger>
						<div className="flex items-center h-full px-4 py-1 text-xs border-l">
							JP <ChevronDown size={18} />
						</div>

						<DropdownMenuContent className="px-8 py-2 mx-1 bg-white border border-black">
							<DropdownMenuItem className="border-none cursor-pointer hover:bg-slate-50">
								<Link to="/workspace/setting/profile">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="border-none cursor-pointer hover:bg-slate-50">
								<Link to="/workspace/setting/security">Security</Link>
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
