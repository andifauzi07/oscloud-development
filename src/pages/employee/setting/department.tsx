/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import MenuList from "../../../components/menuList";
import DataTable from "../../../components/table/dataTable";
import { Button } from "../../../components/ui/button";
const data = [
  {
    departmentName: "Sales department",
    parentDepartment: "-",
    manager: "12",
    employees: "12",
    action: "VIEW",
  },
  {
    departmentName: "Marketing department",
    parentDepartment: "-",
    manager: "45",
    employees: "45",
    action: "VIEW",
  },
  {
    departmentName: "Social media team",
    parentDepartment: "Marketing department",
    manager: "05",
    employees: "05",
    action: "VIEW",
  },
];

const columnHelper = createColumnHelper();

const Department = () => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("departmentName", {
        header: "Department name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("parentDepartment", {
        header: "Parent department",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("manager", {
        header: "Manager",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("employees", {
        header: "Employees",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("action", {
        header: "EDIT",
        cell: (info) => (
          <span className="text-blue-600 cursor-pointer hover:text-blue-700">
            {info.getValue()}
          </span>
        ),
      }),
    ],
    []
  );
  return (
    <div className="h-full flex flex-col">
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
      <div className="w-full flex  justify-end py-2 flex-none container">
        <Button variant={"outline"} className="link">
          CREATE+
        </Button>
      </div>

      <div className="container">
        {/* @ts-ignore */}
        <DataTable columns={columns} rows={data} />
      </div>
    </div>
  );
};

export default Department;
