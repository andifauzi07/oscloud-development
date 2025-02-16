import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/settings/"!</div>
}
