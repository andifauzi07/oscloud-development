import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/setting/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/company/setting/"!</div>
}
