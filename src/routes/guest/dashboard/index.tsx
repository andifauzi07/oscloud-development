import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/guest/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/guest/dashboard/"!</div>
}
