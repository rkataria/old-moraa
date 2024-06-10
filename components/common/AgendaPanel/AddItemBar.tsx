/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react'

import { BsCardText, BsCollection, BsPlus } from 'react-icons/bs'

import { DropdownActions } from '../DropdownActions'

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

type AddItemBarProps = {
  sectionId: string
  slideId: string
  hiddenActionKeys?: string[]
}

export function AddItemBar({
  sectionId,
  slideId,
  hiddenActionKeys = [],
}: AddItemBarProps) {
  const {
    setInsertInSectionId,
    setInsertAfterSlideId,
    setInsertAfterSectionId,
    addSection,
    setOpenContentTypePicker,
    preview,
    isOwner,
    eventMode,
  } = useContext(EventContext) as EventContextType

  const filteredActions = addItemDropdownActions.filter(
    (item) => !hiddenActionKeys.includes(item.key)
  )

  if (preview || !isOwner || eventMode !== 'edit') return null

  return (
    <DropdownActions
      triggerIcon={
        <div
          onClick={() => {
            if (sectionId) setInsertInSectionId(sectionId)
            if (slideId) setInsertAfterSlideId(slideId)
            if (sectionId && !slideId) setInsertAfterSectionId(sectionId)
          }}
          className="absolute left-0 -bottom-2 w-full h-2 bg-transparent z-[1] py-[2px] group/add-item-bar cursor-pointer scale-100">
          <div className="relative left-0 top-[1px] w-full h-0.5 flex justify-end items-center bg-transparent group-hover/add-item-bar:bg-gray-300">
            <div className="w-5 h-5 rounded-full bg-transparent text-transparent flex justify-center items-center group-hover/add-item-bar:bg-gray-300 group-hover/add-item-bar:text-white">
              <BsPlus size={18} />
            </div>
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
          setInsertAfterSlideId(slideId || null)
          if (sectionId) setInsertInSectionId(sectionId)
          setOpenContentTypePicker(true)
        }
      }}
    />
  )

  return (
    <div className="absolute left-0 -bottom-2 w-full h-2 bg-transparent z-[1] py-[2px] group/add-item-bar cursor-pointer">
      <div className="relative left-0 top-0 w-full h-full flex justify-end items-center bg-transparent group-hover/add-item-bar:bg-black">
        <div className="w-5 h-5 rounded-full bg-transparent text-transparent flex justify-center items-center group-hover/add-item-bar:bg-black group-hover/add-item-bar:text-white">
          <BsPlus size={18} />
        </div>
      </div>
    </div>
  )
}
