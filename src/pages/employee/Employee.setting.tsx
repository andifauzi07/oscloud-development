/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createColumnHelper } from "@tanstack/react-table";
import MenuList from "../../components/menuList";
import DataTable from "../../components/table/dataTable";
import { Button } from "../../components/ui/button";

interface DataItem1 {
  field: string;
  type: string;
  category: string;
  dateCreated: string;
  dateAdded: string;
  actions: string;
}

interface DataItem2 {
  previouslyUsed: string;
  type: string;
  category: string;
  dateCreated: string;
  dateAdded: string;
  actions: string;
}

const columnHelper = createColumnHelper<DataItem1 | DataItem2>();

const columns = [
  columnHelper.accessor("field", {
    header: "Data field shown in Profile",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dateCreated", {
    header: "Date created",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dateAdded", {
    header: "Date added",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: "EDIT",
    cell: (info) => info.getValue(),
  }),
];

const data: DataItem1[] = [
  {
    field: "Name",
    type: "Custom Data",
    category: "",
    dateCreated: "2024.11.01",
    dateAdded: "2024.11.01",
    actions: "REMOVE",
  },
  {
    field: "Phone number",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.01",
    dateAdded: "2024.11.01",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
  {
    field: "Email address",
    type: "Custom data",
    category: "Basic information",
    dateCreated: "2024.11.02",
    dateAdded: "2024.11.02",
    actions: "REMOVE",
  },
];

const data2 = [
  {
    previouslyUsed: "Phone number",
    type: "Data",
    createdAt: "2024.11.01",
    removedAt: "2024.11.01",
    edit: "ADD",
  },
  {
    previouslyUsed: "Intro source",
    type: "Data",
    createdAt: "2024.11.02",
    removedAt: "2024.11.02",
    edit: "ADD",
  },
  {
    previouslyUsed: "Personal information",
    type: "Category",
    createdAt: "2024.11.02",
    removedAt: "2024.11.02",
    edit: "ADD",
  },
];

const columns2 = [
  columnHelper.accessor("previouslyUsed", {
    header: "Data field shown in Profile",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dateCreated", {
    header: "Date created",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dateAdded", {
    header: "Date added",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("actions", {
    header: "EDIT",
    cell: (info) => info.getValue(),
  }),
];
function EmployeeSetting() {
  return (
    <div className="h-full flex-1 ">
      {/* menus  */}
      <div className="flex-none border-b min-h-0">
        <div className="container">
          <MenuList
            items={[
              {
                label: "Data Field",
                path: "/dashboard/employee/setting",
              },
              {
                label: "Category",
                path: "/dashboard/employee/setting/category",
              },
              {
                label: "Department",
                path: "/dashboard/employee/setting/department",
              },
            ]}
          />
        </div>
      </div>

      <div className="h-full flex container flex-col  min-h-0">
        <div className="w-full flex  justify-end py-2 flex-none">
          <Button className="link">CREATE+</Button>
        </div>

        {/* list  */}
        <div className="flex-1  flex flex-col gap-10">
          <div className="flex-none h-[30%] min-h-0 ">
            <DataTable
              columns={columns}
              rows={data}
              wrapperClasses=" h-full  "
            />
          </div>
          <div className="flex-1  min-h-0 flex bg-white ">
            <div className="w-full border-r">
              <DataTable
                columns={columns2}
                //@ts-expect-error
                rows={data2}
                wrapperClasses="relative  h-full "
                tableClasses="absolute"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm  border-t py-[10px] px-4 font-medium text-gray-700 border-b border-gray-200  ">
                OSCloud app data
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Status</span>
                    <span className="text-sm text-gray-500">
                      (active / inactive)
                    </span>
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    ADD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSetting;
