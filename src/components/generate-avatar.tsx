'use client'

import { createAvatar } from '@dicebear/core'
import { botttsNeutral, initials } from '@dicebear/collection'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface GenerateAvatarProps {
  seed: string
  className?: string
  variant: 'botttsNeutral' | 'initials'
}

export const GenerateAvatar = ({
  seed,
  className,
  variant,
}: GenerateAvatarProps) => {
  const avatar =
    variant === 'botttsNeutral'
      ? createAvatar(botttsNeutral, { seed })
      : createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 })

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
