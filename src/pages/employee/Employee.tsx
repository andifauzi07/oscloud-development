import { Link } from "@tanstack/react-router";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import MenuList from "../../components/menuList";
import DataTable from "../../components/table/dataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export type Employee = {
  id: number;
  name: string;
  image: string;
  category: string;
  email: string;
  phone: string;
  joinedDate: string;
  hourlyRateA: string;
  hourlyRateB: string;
  projects: number;
  contact: string;
  isTemporary: boolean;
};

const columnHelper = createColumnHelper<Employee>();

export const columns: ColumnDef<Employee>[] = [
  columnHelper.display({
    id: "image",
    cell: ({ row }) => (
      <figure>
        <img className="w-[50px] h-[50px]" src={row.original.image} />
      </figure>
    ),
  }),
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        to={`/dashboard/employee/$userId/profile`}
        params={{ userId: row.original.id.toString() }}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Employee Category",
  },
  {
    accessorKey: "email",
    header: "Email address",
    cell: ({ row }) => (
      <a
        href={`mailto:${row.original.email}`}
        className="text-blue-500 underline"
      >
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },
  {
    accessorKey: "joinedDate",
    header: "Joined date",
  },
  {
    accessorKey: "hourlyRateA",
    header: "Hourly rate A",
  },
  {
    accessorKey: "hourlyRateB",
    header: "Hourly rate AB",
  },
  {
    accessorKey: "projects",
    header: "Projects",
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <a href="#" className="text-blue-500 underline">
        {row.original.contact}
      </a>
    ),
  },

  columnHelper.display({
    id: "action",
    header: "Action",
    cell: () => <Button variant={"secondary"}>Delete</Button>,
  }),
];

export const data: Employee[] = [
  {
    id: 12,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "UI Designer",
    email: "tanaka@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2024.10.25",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 2,
    contact: "tanaka",
    isTemporary: false,
  },
  {
    id: 17,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Full time",
    email: "Takahashi@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.21",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 54,
    contact: "Takahashi",
    isTemporary: false,
  },
  {
    id: 45,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Temporary",
    email: "Ichihara@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.05",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 51,
    contact: "Ichihara",
    isTemporary: true,
  },
  {
    id: 254,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 255,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 256,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 257,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 258,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 259,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 260,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
  {
    id: 3002,
    name: "ABC",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Employee Category A",
    email: "Suzuki@gmail.com",
    phone: "090-1234-1234",
    joinedDate: "2023.10.01",
    hourlyRateA: "¥2,500",
    hourlyRateB: "¥1,800",
    projects: 47,
    contact: "Suzuki",
    isTemporary: false,
  },
];

const Employee = () => {
  const navItems = [
    { label: "List", path: "/dashboard/employee" },
    { label: "Table", path: "/dashboard/employee/table" },
    {
      label: "Setting",
      path: "/dashboard/employee/setting",
    },
  ];
  return (
    <div className=" flex-1 h-full min-h-0 w-full flex flex-col ">
      <div className="border-b flex-none">
        <div className="container">
          <MenuList wrapperClassName="" items={navItems} />
        </div>
      </div>
      <section className=" container w-full border-t border-b min-h-0 flex-1  flex flex-col ">
        <div className="flex flex-none items-center w-full  justify-between py-6">
          <div className="flex w-1/2 gap-10 items-center justify-between">
            <div className="flex flex-col flex-1 gap-2">
              <span className="text-md">Keyword</span>
              <Input className="border rounded-none py-4 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-md">Status</span>
              <div className="flex ">
                <Button variant={"default"} className="hover:text-black">
                  Active
                </Button>
                <Button variant={"outline"}>ALL</Button>
              </div>
            </div>
          </div>
          <div className="flex  w-1/2 justify-end items-center gap-10">
            <div>
              <Button className="bg-white border text-black">
                Advance search
              </Button>
            </div>
            <div className="flex flex-col ">
              <Button className="bg-white border text-black">ADD+</Button>
              <Button className="bg-white border text-black">Edit</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col ">
          <DataTable
            columns={columns}
            rows={data}
            wrapperClasses=" min-h-0 flex-1 relative"
            tableClasses="absolute "
          />
        </div>
      </section>
    </div>
  );
};

export default Employee;
