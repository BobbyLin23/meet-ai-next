import React from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/feature/dashboard/components/dashboard-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="bg-muted flex h-screen w-screen flex-col">
        <DashboardSidebar />
        {children}
      </main>
    </SidebarProvider>
  )
}
