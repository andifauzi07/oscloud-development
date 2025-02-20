import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/setting/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/setting/profile/"!</div>
}
