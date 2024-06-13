import { useContext } from 'react'

import { IconArrowDown, IconArrowUp, IconTrash } from '@tabler/icons-react'
import { BsThreeDotsVertical } from 'react-icons/bs'

import { Button } from '@nextui-org/react'

import { DropdownActions } from './DropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISection } from '@/types/frame.type'

const sectionDropdownActions = [
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrash className="h-4 w-4 text-red-500" />,
  },
  {
    key: 'move-up',
    label: 'Move up',
    icon: <IconArrowUp className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'move-down',
    label: 'Move down',
    icon: <IconArrowDown className="h-4 w-4 text-slate-500" />,
  },
]

export function SectionDropdownActions({
  section,
  onDelete,
}: {
  section: ISection
  onDelete: (section: ISection) => void
}) {
  const { eventMode, isOwner, preview, moveUpSection, moveDownSection } =
    useContext(EventContext) as EventContextType

  if (!isOwner || preview || eventMode !== 'edit') {
    return null
  }

  return (
    <DropdownActions
      triggerIcon={
        <Button isIconOnly size="sm" variant="light" radius="full">
          <BsThreeDotsVertical />
        </Button>
      }
      actions={sectionDropdownActions}
      onAction={(actionKey) => {
        if (actionKey === 'delete') {
          onDelete(section)
        }
        if (actionKey === 'move-up') {
          moveUpSection(section)
        }
        if (actionKey === 'move-down') {
          moveDownSection(section)
        }
      }}
    />
  )
}
