import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/setting/security/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/setting/security/"!</div>
}
