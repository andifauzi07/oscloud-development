import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/$userId/payroll/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/employee/$userId/payroll/"!</div>
}
