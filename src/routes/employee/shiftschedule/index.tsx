import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/shiftschedule/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/employee/shiftschedule/"!</div>
}
