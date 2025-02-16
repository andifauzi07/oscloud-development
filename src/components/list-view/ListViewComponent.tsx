// import { useState, useEffect } from "react";
// import { Link } from "@tanstack/react-router";
// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";

// interface ListViewProps<T> {
//     data: T[];
//     columns: ColumnDef<T>[];
//     title: string;
//     settingsPath: string;
//     storageKey: string;
//     showStatus?: boolean;
// }

// export function ListViewComponent<T>({
//     data,
//     columns,
//     title,
//     settingsPath,
//     storageKey,
//     showStatus = false,
// }: ListViewProps<T>) {
//     const [orderedColumns, setOrderedColumns] =
//         useState<ColumnDef<T>[]>(columns);
//     const [draggedKey, setDraggedKey] = useState<string | null>(null);
//     const [advancedSearchFilter, setAdvancedSearchFilter] = useState("");

//     useEffect(() => {
//         const savedOrder = localStorage.getItem(storageKey);
//         if (savedOrder) {
//             const keysOrder: string[] = JSON.parse(savedOrder);
//             const newOrder = keysOrder
//                 .map((key) => columns.find((col) => col.id === key))
//                 .filter((col) => col !== undefined) as ColumnDef<T>[];
//             if (newOrder.length === columns.length) {
//                 setOrderedColumns(newOrder);
//             }
//         }
//     }, [columns, storageKey]);

//     const handleDragStart = (
//         e: React.DragEvent<HTMLDivElement>,
//         key: string
//     ) => {
//         setDraggedKey(key);
//         e.dataTransfer.effectAllowed = "move";
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = (
//         e: React.DragEvent<HTMLDivElement>,
//         dropKey: string
//     ) => {
//         e.preventDefault();
//         if (!draggedKey || draggedKey === dropKey) return;

//         const newOrder = [...orderedColumns];
//         const fromIndex = newOrder.findIndex((col) => col.id === draggedKey);
//         const toIndex = newOrder.findIndex((col) => col.id === dropKey);

//         const [removed] = newOrder.splice(fromIndex, 1);
//         newOrder.splice(toIndex, 0, removed);

//         setOrderedColumns(newOrder);
//         localStorage.setItem(
//             storageKey,
//             JSON.stringify(newOrder.map((col) => col.id))
//         );
//         setDraggedKey(null);
//     };

//     const handleAdvSearchSelect = (filter: string) => {
//         setAdvancedSearchFilter(filter);
//     };

//     return (
//         <div className="flex flex-col flex-1 h-full">
//             <div className="flex-none min-h-0 py-4 border-b">
//                 <div className="container flex justify-between px-4 md:px-6">
//                     <h1>{title}</h1>
//                     <Link to={settingsPath}>Settings</Link>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-4 px-4 pt-4 border md:flex-row md:px-8 md:gap-16">
//                 <div className="flex flex-col w-full space-y-2 md:w-auto">
//                     <Label htmlFor="keyword">Keyword</Label>
//                     <Input
//                         type="keyword"
//                         id="keyword"
//                         placeholder=""
//                         className="w-full border rounded-none w-[400px]"
//                     />
//                 </div>

//                 {showStatus && (
//                     <div className="flex flex-col space-y-2">
//                         <Label>Status</Label>
//                         <div className="flex">
//                             <Button
//                                 size="default"
//                                 className="w-full bg-black rounded-none md:w-20"
//                             >
//                                 Active
//                             </Button>
//                             <Button
//                                 size="default"
//                                 variant="outline"
//                                 className="w-full rounded-none md:w-20"
//                             >
//                                 All
//                             </Button>
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex flex-col space-y-2 md:p-5 md:m-0">
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 className="w-full md:w-auto"
//                             >
//                                 Advanced search{" "}
//                                 {advancedSearchFilter &&
//                                     `(${advancedSearchFilter})`}
//                                 <ChevronDown className="w-4 h-4 ml-2" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuLabel>
//                                 Advanced Search
//                             </DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                                 onClick={() =>
//                                     handleAdvSearchSelect("Filter by Name")
//                                 }
//                             >
//                                 Filter by Name
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                                 onClick={() =>
//                                     handleAdvSearchSelect("Filter by Date")
//                                 }
//                             >
//                                 Filter by Date
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                                 onClick={() =>
//                                     handleAdvSearchSelect("Clear Filters")
//                                 }
//                             >
//                                 Clear Filters
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>

//             <div className="flex justify-end flex-none w-full">
//                 <Button className="w-1/2 text-black bg-transparent border md:w-20 link border-r-none min-h-14">
//                     ADD+
//                 </Button>
//                 <Button className="w-1/2 text-black bg-transparent border md:w-20 link min-h-14">
//                     EDIT
//                 </Button>
//             </div>

//             <div className="flex-1 overflow-x-auto">
//                 <div className="min-w-[1200px]">
//                     <table className="w-full bg-white border-t border-b border-gray-200 rounded-md shadow-sm">
//                         <thead className="bg-[#f3f4f6]">
//                             <tr>
//                                 {orderedColumns.map((column) => (
//                                     <th
//                                         key={column.id}
//                                         className="p-4 font-bold text-left text-[#0a0a30]"
//                                         draggable
//                                         onDragStart={(e) =>
//                                             handleDragStart(
//                                                 e,
//                                                 column.id as string
//                                             )
//                                         }
//                                         onDragOver={handleDragOver}
//                                         onDrop={(e) =>
//                                             handleDrop(e, column.id as string)
//                                         }
//                                     >
//                                         {column.header as string}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {data.map((item, idx) => (
//                                 <tr key={idx}>
//                                     {orderedColumns.map((column) => (
//                                         <td
//                                             key={`${idx}-${column.id}`}
//                                             className="p-4"
//                                         >
//                                                 <div>
//                                                     {column.cell.toString()}
//                                                 </div>
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }
