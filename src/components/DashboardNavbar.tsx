import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { signOut } from "../backend/auth/auth";

const links = [
  { name: "oscloud", path: "/" },
  { name: "osanalytics", path: "/" },
  { name: "osmerge", path: "/dashboard" },
  { name: "support", path: "/" },
  { name: "documentation", path: "/" },
  { name: "settings", path: "/dashboard/workspace-member" },
];

const DashboardNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/signin" });
  };

  return (
    <nav className="border-b border-black h-[var(--top-navbar-height)] flex flex-col justify-center  z-50 sticky top-0 w-full bg-white">
      <ul className="flex justify-between">
        <div className="flex">
          {links.map(({ name, path }) => (
            <li key={name} className="border-l border-black px-4">
              <Link
                className="text-black text-xs hover:text-gray-700"
                to={path}
              >
                {name}
              </Link>
            </li>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <MenuIcon size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-8 border border-black">
            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 border-none">
              <Link to="/">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 border-none">
              <Link to="/">Security</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-slate-50 border-none"
              onClick={() => handleLogout()}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;
