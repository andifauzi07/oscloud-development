/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import MenuList from "../../../components/menuList";
import DataTable from "../../../components/table/dataTable";
import { Button } from "../../../components/ui/button";

const data = [
  {
    category: "Basic information",
    type: "Category",
    parentCategory: "",
    action: "VIEW",
  },
  {
    category: "SNS",
    type: "Custom data",
    parentCategory: "Basic information",
    action: "VIEW",
  },
  {
    category: "Regal",
    type: "osCloud app data",
    parentCategory: "Basic information",
    action: "VIEW",
  },
];
const columnHelper = createColumnHelper();

const Category = () => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("parentCategory", {
        header: "Category",
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

export default Category;
