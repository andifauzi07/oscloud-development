import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useDepartment, useDepartments } from '@/hooks/useDepartment'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-2">
    </div>
  )
}