import { useContext } from 'react'

import { AddItemStickyDropdownActions } from '../AddItemStickyDropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'

export function AddContentButton({ className }: { className?: string }) {
  const { setOpenContentTypePicker } = useContext(
    EventContext
  ) as EventContextType
  const { permissions } = useEventPermissions()

  const { preview, eventMode } = useContext(EventContext) as EventContextType

  if (preview || !permissions.canCreateFrame || eventMode !== 'edit') {
    return <div />
  }

  return (
    <AddItemStickyDropdownActions
      className={className}
      onOpenContentTypePicker={() => {
        setOpenContentTypePicker?.(true)
      }}
    />
  )
}
