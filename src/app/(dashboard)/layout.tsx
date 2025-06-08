import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/app/(dashboard)/_components/dashboard-sidebar'
import { DashboardNavbar } from '@/app/(dashboard)/_components/dashboard-navbar'
import { auth } from '@/lib/auth'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/sign-in')
  }

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
