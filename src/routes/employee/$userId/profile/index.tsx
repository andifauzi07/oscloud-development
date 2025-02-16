import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/$userId/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/employee/$userId/profile/"!</div>
}
