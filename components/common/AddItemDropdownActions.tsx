/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { BsCardText, BsCollection } from 'react-icons/bs'
import { LuPlusCircle } from 'react-icons/lu'

import { DropdownActions } from './DropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

const addItemDropdownActions = [
  {
    key: 'new-section',
    label: 'New Section',
    icon: <BsCollection className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'new-frame',
    label: 'New Frame',
    icon: <BsCardText className="h-4 w-4 text-slate-500" />,
  },
]

export function AddItemDropdownActions({
  sectionId,
  frameId,
  hiddenActionKeys = [],
  hidden = false,

  className,
  onOpenContentTypePicker,
}: {
  sectionId: string
  frameId?: string
  hiddenActionKeys?: string[]
  hidden?: boolean

  className?: string
  onOpenContentTypePicker?: (open: boolean) => void
}) {
  const {
    setInsertInSectionId,
    setInsertAfterFrameId,
    setInsertAfterSectionId,
    addSection,
  } = useContext(EventContext) as EventContextType

  const filteredActions = addItemDropdownActions.filter(
    (item) => !hiddenActionKeys.includes(item.key)
  )

  if (hidden) return null

  return (
    <DropdownActions
      triggerIcon={
        <div
          className={cn(
            'relative flex-none h-4 grid place-items-center w-full group cursor-pointer',
            className
          )}
          onClick={() => {
            if (sectionId) setInsertInSectionId(sectionId)
            if (frameId) setInsertAfterFrameId(frameId)
            if (sectionId && !frameId) setInsertAfterSectionId(sectionId)
          }}>
          <div className="w-full h-0.5 bg-gray-100 group-hover:bg-gray-300 rounded-full flex justify-center items-center transition-all duration-300">
            <LuPlusCircle className="text-gray-100 group-hover:text-gray-300 bg-white rounded-full transition-all duration-300" />
          </div>
        </div>
      }
      actions={filteredActions}
      onAction={(actionKey) => {
        if (actionKey === 'new-section') {
          addSection({
            afterSectionId: sectionId,
          })
        }

        if (actionKey === 'new-frame') {
          setInsertAfterFrameId(frameId || null)
          if (sectionId) setInsertInSectionId(sectionId)
          onOpenContentTypePicker?.(true)
        }
      }}
    />
  )
}
