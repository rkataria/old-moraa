import { useState } from 'react'

import { Button } from '@nextui-org/react'
import { Link, useLocation } from '@tanstack/react-router'
import { IconType } from 'react-icons'
import { HiOutlineTemplate } from 'react-icons/hi'
import { LuCalendarHeart, LuHome, LuLibrary } from 'react-icons/lu'

import { cn } from '@/utils/utils'

type TNavigation = {
  name: string
  href: string
  icon: IconType
}

export function SidebarItem() {
  const location = useLocation()
  const [navigation] = useState<TNavigation[]>([
    {
      name: 'Home',
      href: '/events',
      icon: LuHome,
    },
    {
      name: 'My workshops',
      href: '/workshops',
      icon: LuCalendarHeart,
    },
    {
      name: 'My Library',
      href: '/library',
      icon: LuLibrary,
    },
    {
      name: 'Community templates',
      href: '/templates',
      icon: HiOutlineTemplate,
    },
  ])

  return (
    <div className="grid gap-2">
      {navigation.map((item) => (
        <Button
          as={Link}
          href={item.href}
          variant="light"
          className={cn(
            'hover:bg-[#EDE0FB] w-full justify-start font-semibold text-slate-600 tracking-tight gap-[0.625rem]',
            {
              'bg-[#EDE0FB]': item.href === location.pathname,
            }
          )}>
          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
          {item.name}
        </Button>
      ))}
    </div>
  )
}
