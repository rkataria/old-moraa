/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react'

import { Button } from '@heroui/react'
import { IconX } from '@tabler/icons-react'
import { Menu } from 'lucide-react'

import { SidebarItem } from './SidebarItem'

import { cn } from '@/utils/utils'

export function SidebarMini() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <div
        className="flex justify-center items-center cursor-pointer h-16 shrink-0 bg-white text-black dark:bg-background dark:text-foreground px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
        onClick={() => setOpen((o) => !o)}>
        <Menu />
      </div>
      <div
        className={cn('bg-primary fixed left-0 top-0 h-screen', {
          'w-72 block': open,
          'w-0 hidden': !open,
        })}>
        <div className="relative flex justify-between items-center p-4">
          <h5 className="text-white font-semibold text-lg">Moraa</h5>
          <Button
            size="sm"
            variant="ghost"
            isIconOnly
            className="absolute right-2 top-2 flex justify-center items-center"
            onClick={() => setOpen(false)}>
            <IconX />
          </Button>
        </div>
        <div className="p-4">
          <SidebarItem />
        </div>
      </div>
    </div>
  )
}
