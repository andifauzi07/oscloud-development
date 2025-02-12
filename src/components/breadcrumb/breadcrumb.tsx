import { Link } from "@tanstack/react-router";
import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as ShadcnBreadcrumb,
} from "../ui/breadcrumb";

export function Breadcrumb() {
  return (
    <div className="w-full flex-none bg-white sticky top-0 h-[var(--breadcrumb-height)] flex flex-col justify-center">
      <div className="container">
        <ShadcnBreadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/dashboard/employee">Employee</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/dashboard/employee">Employee</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>List</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </ShadcnBreadcrumb>
      </div>
    </div>
  );
}
