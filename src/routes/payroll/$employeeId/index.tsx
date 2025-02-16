import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payroll/$employeeId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/payroll/$employeeId/"!</div>
}
