// TODO: Refactor folder may change when supabase is here

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/company/setting/datacategory/datacategoryView/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/company/setting/datacategory/datacategoryView/"!</div>
}
