import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/project/$projectId/page"!</div>
}
