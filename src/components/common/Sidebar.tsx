import { useNavigate } from '@tanstack/react-router'
import { MdOutlineAddBox } from 'react-icons/md'

import { MoraaLogo } from './MoraaLogo'
import { SidebarItem } from './SidebarItem'
import { Button } from '../ui/Button'

export function SidebarComponent() {
  const navigate = useNavigate()

  return (
    <div className="sticky left-0 top-0 w-56 h-screen px-4 shrink-0">
      <div className="flex flex-col grow gap-y-4 overflow-y-auto pb-4">
        <div className="flex items-center justify-between">
          <MoraaLogo color="primary" filled />
        </div>
        <Button
          onClick={() => navigate({ to: '/events/create' })}
          color="primary"
          startContent={<MdOutlineAddBox size={18} aria-hidden="true" />}>
          Create new
        </Button>
        <SidebarItem />
      </div>
    </div>
  )
}
