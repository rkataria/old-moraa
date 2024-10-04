import { useLocation, useRouter } from '@tanstack/react-router'
import { IconType } from 'react-icons'
import { GoHome, GoHomeFill } from 'react-icons/go'
import { IoHelpCircleOutline, IoHelpCircleSharp } from 'react-icons/io5'

import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

type TNavigation = {
  name: string
  href: string
  icon: IconType
  filled: IconType
}

const navigation: TNavigation[] = [
  {
    name: 'Home',
    href: '/events',
    icon: GoHome,
    filled: GoHomeFill,
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
    icon: IoHelpCircleOutline,
    filled: IoHelpCircleSharp,
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
          size="md"
          fullWidth
          className={cn(
            'flex justify-start items-center gap-3 bg-transparent hover:bg-gray-200 py-5',
            {
              'bg-primary/15 text-primary font-medium':
                item.href === location.pathname,
            }
          )}
          onClick={() => {
            history.push(item.href)
          }}>
          {item.href === location.pathname ? (
            <item.filled className="shrink-0" aria-hidden="true" size={22} />
          ) : (
            <item.icon className="shrink-0" aria-hidden="true" size={22} />
          )}
          {item.name}
        </Button>
      ))}
    </div>
  )
}
