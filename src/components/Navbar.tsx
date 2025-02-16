import { Link } from "@tanstack/react-router";
const links = [
  { name: "oscloud", path: "/" },
  { name: "osanalytics", path: "/" },
  { name: "osmerge", path: "/" },
  { name: "support", path: "/" },
  { name: "documentation", path: "/" },
  { name: "settings", path: "/" },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-black ">
      <ul className="flex justify-between">
        <div className="flex">
          {links.map(({ name, path }) => (
            <li key={name} className="px-4 border-l border-black">
              <Link
                className="text-xs text-black hover:text-gray-700"
                to={path}
              >
                {name}
              </Link>
            </li>
          ))}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
