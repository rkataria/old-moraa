/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { BsCardText, BsCollection } from 'react-icons/bs'
import { LuPlusCircle } from 'react-icons/lu'

import { DropdownActions } from './DropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

const addItemDropdownActions = [
  {
    key: 'new-section',
    label: 'New Section',
    icon: <BsCollection className="h-4 w-4 text-slate-500" />,
  },
  {
    key: 'new-slide',
    label: 'New Slide',
    icon: <BsCardText className="h-4 w-4 text-slate-500" />,
  },
]

export function AddItemDropdownActions({
  sectionId,
  slideId,
  hiddenActionKeys = [],
  hidden = false,
  onOpenContentTypePicker,
}: {
  sectionId?: string
  slideId?: string
  hiddenActionKeys?: string[]
  hidden?: boolean
  onOpenContentTypePicker?: (open: boolean) => void
}) {
  const {
    setInsertInSectionId,
    setInsertAfterSlideId,
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
          className="flex-none absolute -bottom-5 left-0 py-1 h-4 w-full px-2 group cursor-pointer"
          onClick={() => {
            if (sectionId) setInsertInSectionId(sectionId)
            if (slideId) setInsertAfterSlideId(slideId)
            if (sectionId && !slideId) setInsertAfterSectionId(sectionId)
          }}>
          <div className="w-full h-1 bg-gray-100 group-hover:bg-gray-300 rounded-full flex justify-center items-center transition-all duration-200">
            <LuPlusCircle className="text-gray-100 group-hover:text-gray-300 bg-white transition-all duration-200" />
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

        if (actionKey === 'new-slide') {
          if (slideId) setInsertAfterSlideId(slideId)
          if (sectionId) setInsertInSectionId(sectionId)
          onOpenContentTypePicker?.(true)
        }
      }}
    />
  )
}
