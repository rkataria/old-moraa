/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactNode, useContext } from 'react'

import { BsCardText, BsCollection, BsPlus } from 'react-icons/bs'

import { DropdownActions } from '../DropdownActions'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'

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

type AddItemBarProps = {
  sectionId: string
  frameId: string
  hiddenActionKeys?: string[]
  trigger?: ReactNode
  onAddFrame?: () => void
}

export function AddItemBar({
  sectionId,
  frameId,
  hiddenActionKeys = [],
  trigger,
  onAddFrame,
}: AddItemBarProps) {
  const {
    setInsertInSectionId,
    setInsertAfterFrameId,
    setInsertAfterSectionId,
    addSection,
    setOpenContentTypePicker,
    preview,
    eventMode,
  } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  const filteredActions = addItemDropdownActions.filter(
    (item) => !hiddenActionKeys.includes(item.key)
  )

  if (preview || !permissions.canCreateFrame || eventMode !== 'edit') {
    return null
  }

  const handleOnClick = () => {
    if (sectionId) setInsertInSectionId(sectionId)
    if (frameId) setInsertAfterFrameId(frameId)
    if (sectionId && !frameId) setInsertAfterSectionId(sectionId)
  }

  const renderTrigger = () => {
    if (trigger) {
      return <div onClick={handleOnClick}>{trigger}</div>
    }

    return (
      <div
        onClick={handleOnClick}
        className="absolute left-0 -bottom-2 w-full h-2 bg-transparent z-[1] py-[2px] group/add-item-bar cursor-pointer scale-100">
        <div className="relative left-0 top-[1px] w-full h-0.5 flex justify-end items-center bg-transparent group-hover/add-item-bar:bg-gray-300">
          <div className="w-5 h-5 rounded-full bg-transparent text-transparent flex justify-center items-center group-hover/add-item-bar:bg-gray-300 group-hover/add-item-bar:text-white">
            <BsPlus size={18} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <DropdownActions
      triggerIcon={renderTrigger()}
      actions={filteredActions}
      onAction={(actionKey) => {
        if (actionKey === 'new-section') {
          addSection({
            afterSectionId: sectionId,
          })
        }

        if (actionKey === 'new-frame') {
          if (onAddFrame) {
            onAddFrame()

            return
          }
          setInsertAfterFrameId(frameId || null)
          if (sectionId) setInsertInSectionId(sectionId)
          setOpenContentTypePicker(true)
        }
      }}
    />
  )
}
