import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features/ProfitLoss/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/features/ProfitLoss/"!</div>
}
