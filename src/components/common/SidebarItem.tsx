import { useLocation, useRouter } from '@tanstack/react-router'
import { IconType } from 'react-icons'
import { LuHelpCircle, LuHome } from 'react-icons/lu'

import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

type TNavigation = {
  name: string
  href: string
  icon: IconType
}

const navigation: TNavigation[] = [
  {
    name: 'Home',
    href: '/events',
    icon: LuHome,
  },
  // {
  //   name: 'My workshops',
  //   href: '/workshops',
  //   icon: LuCalendarHeart,
  // },
  // {
  //   name: 'My Library',
  //   href: '/library',
  //   icon: LuLibrary,
  // },
  // {
  //   name: 'Community templates',
  //   href: '/templates',
  //   icon: HiOutlineTemplate,
  // },
  {
    name: 'Help & Support',
    href: '/help',
    icon: LuHelpCircle,
  },
]

export function SidebarItem() {
  const location = useLocation()
  const { history } = useRouter()

  return (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => (
        <Button
          key={item.name}
          size="sm"
          fullWidth
          className={cn(
            'flex justify-start items-center gap-2 bg-transparent hover:bg-gray-200',
            {
              'bg-primary-100': item.href === location.pathname,
            }
          )}
          onClick={() => {
            history.push(item.href)
          }}>
          <item.icon className="shrink-0" aria-hidden="true" size={18} />
          {item.name}
        </Button>
      ))}
    </div>
  )
}
