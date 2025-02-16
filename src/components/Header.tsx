import { useLocation } from "@tanstack/react-router";

function Header() {
  const location = useLocation();
  const segments = location.pathname
    .split('/')
    .filter(Boolean);

  // ignore the second segments
  const displaySegments = segments.slice(2).map(seg => seg.charAt(0).toUpperCase() + seg.slice(1));
  const displayPath = displaySegments.length > 0 ? `# ${displaySegments.join('/')}` : "";

  return (
    <div className="w-full border-b flex flex-none flex-col justify-center h-[var(--header-height)]  p-4 px-6">
      <div className="container">
        <div className="flex items-center w-full gap-6">
          {/* logo  */}
          <div className="flex-none p-2 bg-green-700">
            <div className="p-1 bg-red-950"></div>
          </div>
          {/* app name  */}
          <div className="flex-grow">
            <span className="text-sm text-gray-400">Employee List</span>
            <h3 className="font-semibold text-md">{displayPath}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
