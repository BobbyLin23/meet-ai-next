import { Dispatch, SetStateAction } from 'react'

import {
  CommandResponsiveDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

export const DashboardCommand = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search-emoji">Search Emoji</CommandItem>
          <CommandItem value="calculator">Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile">Profile</CommandItem>
          <CommandItem value="billing">Billing</CommandItem>
          <CommandItem value="settings">Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  )
}
