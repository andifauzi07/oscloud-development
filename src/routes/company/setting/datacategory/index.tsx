import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/setting/datacategory/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/company/setting/datacategory/"!</div>
}
