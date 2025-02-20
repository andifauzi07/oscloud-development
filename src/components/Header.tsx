import { useLocation } from '@tanstack/react-router';

function Header() {
	const location = useLocation();
	const segments = location.pathname.split('/').filter(Boolean);

	// ignore the second segments
	const displaySegments = segments.slice(2).map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));
	const displayPath = displaySegments.length > 0 ? `# ${displaySegments.join('/')}` : '';

	const result = location.pathname.split('/')[1];
	const title = result.charAt(0).toUpperCase() + result.slice(1);

	return (
		<div className="w-full border-b flex flex-none flex-col justify-center h-[var(--header-height)]  p-4 px-6">
			<div className="container">
				<div className="flex items-center w-full gap-4">
					{/* logo  */}
                    <div className="flex-none p-1 bg-[#b0bd94]">
                        <div className="p-1 bg-[#550a00]"></div>
                    </div>
					{/* app name  */}
					<div className="flex-grow">
						{/* <span className="text-sm text-black">Employee List</span> */}
						<h3 className="font-semibold text-md"># {title ? title : 'Home'}</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header;
