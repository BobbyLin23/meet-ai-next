import React from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/feature/dashboard/components/dashboard-sidebar'
import { DashboardNavbar } from '@/feature/dashboard/components/dashboard-navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="bg-muted flex h-screen w-screen flex-col">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  )
}
