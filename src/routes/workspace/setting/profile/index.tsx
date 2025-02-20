import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/setting/profile/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { selectedWorkspace, loading, error, updateWorkspace } = useWorkspace(workspaceId);

    return <div>Hello "/workspace/setting/profile/"!</div>
}