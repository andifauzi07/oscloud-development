import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features/CompanyList/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/features/CompanyList/"!</div>
}
