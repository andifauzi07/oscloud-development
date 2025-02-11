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
  columns: ColumnDef<TData>[];
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
        "w-full h-full overflow-auto min-w-full bg-white  border-collapse ",
        wrapperClasses
      )}
    >
      <table
        className={cn(
          "table-auto  min-w-full overflow-auto bg-white",
          tableClasses
        )}
      >
        <thead className="border-t text-nowrap">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-nowrap">
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
