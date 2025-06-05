'use client'

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useIsMobile } from '@/hooks/use-mobile'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { GenerateAvatar } from '@/components/generate-avatar'

export const DashboardUserButton = () => {
  const router = useRouter()

  const isMobile = useIsMobile()

  const { data } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        },
      },
    })
  }

  if (!data) {
    return null
  }

  const triggerContent = (
    <>
      {data.user.image ? (
        <Avatar>
          <AvatarImage
            src={data.user.image}
            alt={data.user.name || 'User Avatar'}
          />
        </Avatar>
      ) : (
        <GenerateAvatar
          seed={data.user.name}
          variant="initials"
          className="mr-3 size-9"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
        <p className="w-full truncate text-sm">{data.user.name}</p>
        <p className="w-full truncate text-xs">{data.user.email}</p>
      </div>
      <ChevronDownIcon className="size-4 shrink-0" />
    </>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="border-border/10 flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
          {triggerContent}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline">
              <CreditCardIcon className="mr-2 size-4" />
              Billing
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-border/10 flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-white/5 p-3 hover:bg-white/10">
        {triggerContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="text-muted-foreground truncate text-sm font-normal">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between"
          onClick={handleLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
