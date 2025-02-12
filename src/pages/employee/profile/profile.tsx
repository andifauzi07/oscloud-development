import { Link, Outlet, useLocation, useParams } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const InfoSection = ({
  title,
  items,
}: {
  title: React.ReactNode;
  items: { label: string; value: string }[];
}) => (
  <div className="flex flex-col">
    <h2 className="px-4 py-2 bg-gray-100 text-sm font-medium">{title}</h2>
    <div className="divide-y">
      {items.map((item, index) => (
        <div key={index} className="flex border-gray-200 gap-8">
          <div className="w-32 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">
            <span>{item?.label}</span>
          </div>
          <div className="flex-1 px-4 py-3 text-sm">
            <span>{item?.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export function Profile() {
  const { userId } = useParams({ strict: false });
  const location = useLocation();
  const isCurrentPath =
    location.pathname === `/dashboard/employee/${userId}/profile`;
  // console.log(isCurrentPath);

  const tabs = [
    { label: "Profile", path: `/dashboard/employee/${userId}` },
    {
      label: "Shift schedule",
      path: `/dashboard/employee/${userId}/profile/shift-schedule`,
    },
    {
      label: "Performance",
      path: `/dashboard/employee/${userId}/profile/performance`,
    },
    {
      label: "Projects",
      path: `/dashboard/employee/${userId}/profile/project`,
    },
    { label: "Payroll", path: `/dashboard/employee/${userId}/profile/payroll` },
  ];

  const basicInfo = [
    { label: "UserID", value: "終日" },
    { label: "名前", value: "John Brown" },
    { label: "なまえ", value: "終日" },
    { label: "誕生日", value: "終日" },
    { label: "2024.11.25", value: "9:00 ~ 17:00" },
    { label: "2024.11.28", value: "終日" },
  ];

  const contractInfo = [
    { label: "UserID", value: "終日" },
    { label: "名前", value: "9:00 ~ 17:00" },
    { label: "なまえ", value: "終日" },
    { label: "誕生日", value: "終日" },
    { label: "2024.11.25", value: "9:00 ~ 17:00" },
    { label: "2024.11.28", value: "終日" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Fixed header section */}

      <nav className="border-b flex-none  sticky top-[var(--breadcrumb-height)]  bg-gray-50">
        <ul className="list-none flex gap-12 h-full">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <Link
                to={tab.path}
                className="block py-2 px-3 text-sm font-medium border-b-2 transition-colors aria-[current=page]:border-blue-500 aria-[current=page]:font-semibold border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isCurrentPath && (
        <>
          <div className="flex-none  ">
            <div className="border-b">
              <h2 className="py-3 container">John Brown</h2>
            </div>
            <div className="border-b">
              <div className="w-full flex container justify-end items-center py-2">
                <Button>EDIT</Button>
              </div>
            </div>
          </div>
          {/* Scrollable content section */}
          <div className="flex-1 min-h-0">
            {/* Image and list container */}
            <div className="flex ">
              {/* Left side - Image section */}
              <div className="w-[30%] flex flex-col">
                <figure className="w-full h-[65%] relative overflow-hidden">
                  <img
                    className="w-full absolute top-[50%] left-[50%] right-[50%] transform translate-x-[-50%] translate-y-[-50%] "
                    src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile"
                  />
                </figure>
                <div className="flex flex-col items-center ">
                  <h4 className="py-3">Profile name</h4>
                  <p className="pb-3">PNG, JPEG, (3MG)</p>
                  <div>
                    <label htmlFor="profile_upload" className="cursor-pointer">
                      UPLOAD
                    </label>
                    <Input id="profile_upload" type="file" className="hidden" />
                  </div>
                </div>
              </div>

              {/* Right side - Info sections */}
              <div className="w-[70%] overflow-y-auto">
                <InfoSection items={basicInfo} title="Basic Information" />
                <InfoSection items={contractInfo} title="Contact" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Outlet section */}
      <div className="flex-none">
        <Outlet />
      </div>
    </div>
  );
}
