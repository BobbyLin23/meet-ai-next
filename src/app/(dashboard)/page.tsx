'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        },
      },
    })
  }

  return (
    <div className="bg-background p-3">
      Hello World!
      <Button onClick={handleLogout}>Log out</Button>
    </div>
  )
}
