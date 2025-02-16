import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/$userId/performance/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/employee/$userId/performance/"!</div>
}
