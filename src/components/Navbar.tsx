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
    <nav className="border-b border-black z-50 sticky top-0 w-full bg-white">
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
      </ul>
    </nav>
  );
};

export default Navbar;
