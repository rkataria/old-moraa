import { Key, useContext } from 'react'

import { Tab, Tabs } from '@nextui-org/react'
import { useNavigate } from '@tanstack/react-router'
import { LuRectangleVertical } from 'react-icons/lu'
import { MdEdit } from 'react-icons/md'

import { Tooltip } from './ShortuctTooltip'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function PreviewSwitcher() {
  const navigate = useNavigate()
  const { preview, setPreview } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()

  if (!permissions.canUpdateFrame) {
    return null
  }

  const handlePreviewSwitcher = (selectedKey: Key) => {
    if (preview && selectedKey === 'preview') return
    if (!preview && selectedKey === 'edit') return

    setPreview(!preview)

    navigate({
      search: { action: preview ? 'edit' : 'view' },
    })
  }

  return (
    <Tabs
      size="sm"
      keyboardActivation="manual"
      shouldSelectOnPressUp={false}
      classNames={{
        tabList: 'bg-gray-200',
        tab: '!opacity-100 px-2',
      }}
      onSelectionChange={handlePreviewSwitcher}
      selectedKey={preview ? 'preview' : 'edit'}>
      <Tab
        key="preview"
        className={cn('!outline-none', {
          'shadow-2xl': preview,
        })}
        title={
          <Tooltip label="Preview" actionKey="P">
            <div
              className={cn('flex items-center gap-1', {
                'text-black': !preview,
              })}>
              <LuRectangleVertical size={20} />
              <span className="font">Preview</span>
            </div>
          </Tooltip>
        }
      />
      <Tab
        className={cn('!outline-none', {
          'shadow-2xl': !preview,
        })}
        key="edit"
        title={
          <Tooltip label="Edit" actionKey="E">
            <div
              className={cn('flex items-center gap-1', {
                'text-black': preview,
              })}>
              <MdEdit size={18} />
              <span className="font">Edit</span>
            </div>
          </Tooltip>
        }
      />
    </Tabs>
  )
}
