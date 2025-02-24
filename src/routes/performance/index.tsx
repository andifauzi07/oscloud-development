import { CompanyPersonnelLeadsListDataTable } from "@/components/companyPersonnelLeadsListDataTable";
import { EmployeePerformanceCell } from "@/components/EmployeePerformanceCell";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDebounce from "@/hooks/useDebounce";
import { useWorkspaceEmployees } from "@/hooks/useEmployee";
import {
	getCategoryScore,
	useEmployeePerformance,
	usePerformanceSheets,
	usePerformanceTemplates,
} from "@/hooks/usePerformance";
import { useUserData } from "@/hooks/useUserData";
import { fetchEmployeePerformance } from "@/store/slices/performanceSlice";
import { AppDispatch, RootState } from "@/store/store";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Route = createFileRoute("/performance/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [searchQuery, setSearchQuery] = useState("");
	const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { employees, loading: employeesLoading } = useWorkspaceEmployees();
	const { templates, loading: templatesLoading } = usePerformanceTemplates();
	const { sheets, loading: sheetsLoading } = usePerformanceSheets({
		startDate: dateRange.startDate,
		endDate: dateRange.endDate,
	});

	const { workspaceid } = useUserData();

	const defaultTemplate = templates[0];
	const { performanceData, loading: employeePerformanceLoading } =
		useEmployeePerformance({
			workspaceId: Number(workspaceid),
			// templateId: defaultTemplate?.templateid,
			// Pass employeeId if you want to fetch data for a specific employee
			// employeeId: someEmployeeId,
		});

	const filteredEmployees = employees?.filter((employee: any) =>
		employee.name.toLowerCase().includes(debouncedSearch.toLowerCase())
	);

	const columns: ColumnDef<any>[] = useMemo(() => [
		{
			accessorKey: "profileimage",
			header: "",
			cell: ({ row }: any) => (
				<div className="flex items-center justify-center h-full">
					<figure className="w-16 h-16 overflow-hidden">
						<img
							className="object-cover w-full h-full"
							src={row.original.profileimage || "/default-avatar.png"}
							alt={`${row.original.name}'s profile`}
						/>
					</figure>
				</div>
			),
		},
		{
			accessorKey: "employeeid",
			header: "ID",
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }: any) => (
				<Link
					to={`/performance/$employeeId`}
					params={{ employeeId: row.original.employeeid }}
					className="text-blue-600 hover:underline"
				>
					{row.original.name}
				</Link>
			),
		},
		{
			accessorKey: "employeeCategory.categoryname",
			header: "Employee Category",
			cell: ({ row }: any) =>
				row.original.employeeCategory?.categoryname || "-",
		},
		...(defaultTemplate?.categories?.map((category: any) => ({
			accessorKey: `performance_${category.categoryid}`,
			header: category.categoryname,
			cell: (
				{ row }: any // Add parentheses to return the component
			) => (
				<EmployeePerformanceCell
					workspaceId={Number(workspaceid)}
					employeeId={row.original.employeeid}
					templateId={defaultTemplate.templateid}
					categoryId={category.categoryid}
				/>
			),
		})) || []),
		{
			id: "actions",
			header: "",
			cell: ({ row }: any) => (
				<Link
					to={`/performance/$employeeId`}
					params={{ employeeId: row.original.employeeid }}
				>
					<Button variant="outline" className="w-20">
						DETAIL
					</Button>
				</Link>
			),
		},
	], [workspaceid, defaultTemplate]);

	if (employeesLoading || templatesLoading || employeePerformanceLoading) {
		return <Loading />;
	}

	if (!employees?.length || !templates?.length) {
		return <div>No data available</div>;
	}

	return (
		<div className="flex flex-col flex-1 h-full">
			<div className="flex-none min-h-0 px-4 py-2 bg-white border-b border-r">
				<div className="container flex justify-between bg-white md:px-6">
					<h1>Performance</h1>
					<Link to="/performance/setting">Settings</Link>
				</div>
			</div>

			<div className="flex flex-row flex-wrap items-center justify-between w-full px-8 py-4 bg-white border-b border-r md:flex-row">
				<div className="flex flex-row flex-wrap gap-4">
					<div className="flex flex-col w-full space-y-2 md:w-auto">
						<Label htmlFor="keyword">Keyword</Label>
						<Input
							type="text"
							id="keyword"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search employees..."
							className="border rounded-none w-[400px]"
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<Label>Duration</Label>
					<div className="flex items-center gap-2">
						<Input
							type="date"
							value={dateRange.startDate}
							onChange={(e) =>
								setDateRange({ ...dateRange, startDate: e.target.value })
							}
							className="w-[150px] border rounded-none"
						/>
						<span className="text-gray-500">-</span>
						<Input
							type="date"
							value={dateRange.endDate}
							onChange={(e) =>
								setDateRange({ ...dateRange, endDate: e.target.value })
							}
							className="w-[150px] border rounded-none"
						/>
					</div>
				</div>
			</div>
			{/* Responsive action buttons */}
			<div className="flex justify-end flex-none w-full bg-white">
				<Button className="text-black bg-transparent border-l border-r md:w-20 link border-r-none min-h-10">
					ADD+
				</Button>
				<Button className="text-black bg-transparent border-r md:w-20 link min-h-10">
					EDIT
				</Button>
			</div>
			<div className="border-r border-t">
				<DataTable columns={columns} data={filteredEmployees || []} />
			</div>
		</div>
	);
}
