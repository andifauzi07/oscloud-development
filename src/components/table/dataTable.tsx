import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "../../lib/utils";

export interface DataTableProps<TData extends RowData> {
  wrapperClasses?: string;
  tableClasses?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  rows: TData[];
}

const DataTable = <TData extends RowData>({
  columns,
  rows,
  tableClasses,
  wrapperClasses,
}: DataTableProps<TData>) => {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "w-full relative overflow-auto h-full  mb-1 bg-white  border-collapse ",
        wrapperClasses
      )}
    >
      <table
        className={cn(
          "table-auto  min-w-full  max-h-full overflow-auto top-0 left-0 border-collapse bg-white",
          tableClasses
        )}
      >
        <thead className="border-t text-nowrap">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="text-nowrap sticky top-[-2px] transition-all duration-500 bg-white"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-2 border-b text-left text-nowrap px-3"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="border-b text-nowrap">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-nowrap">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-2 border-b text-left text-nowrap px-3"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
