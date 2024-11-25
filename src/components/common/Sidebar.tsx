import { useNavigate } from '@tanstack/react-router'
import { MdAdd } from 'react-icons/md'

import { RenderIf } from './RenderIf/RenderIf'
import { SidebarItem } from './SidebarItem'
import { Button } from '../ui/Button'

import { useProfile } from '@/hooks/useProfile'
import { UserType } from '@/types/common'

export function SidebarComponent() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()

  const isEducator = () => {
    if (!profile) return false

    return profile.user_type === UserType.EDUCATOR
  }

  return (
    <div className="sticky left-0 top-0 w-56 h-full px-4 shrink-0 bg-white pt-7">
      <div className="flex flex-col grow gap-y-4 overflow-y-auto pb-4">
        <RenderIf isTrue={isEducator()}>
          <Button
            gradient="primary"
            size="md"
            onClick={() => navigate({ to: '/events/create' })}
            color="primary"
            className="text-white font-medium"
            startContent={<MdAdd size={24} aria-hidden="true" />}>
            Create new
          </Button>
        </RenderIf>

        <SidebarItem />
      </div>
    </div>
  )
}
