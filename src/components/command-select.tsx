'use client'

import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from '@/components/ui/command'

interface CommandSelectProps {
  options: Array<{
    id: string
    value: string
    children: React.ReactNode
  }>
  onSelect: (value: string) => void
  onSearch?: (value: string) => void
  value: string
  placeholder?: string
  isSearchable?: boolean
  className?: string
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder,
  isSearchable,
  className,
}: CommandSelectProps) => {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => value === option.value)

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-9 justify-between px-2 font-normal',
          className,
          !selectedOption && 'text-muted-foreground'
        )}
        onClick={() => setOpen(true)}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronDownIcon />
      </Button>
      <CommandResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Seach..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value)
                setOpen(false)
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  )
}
