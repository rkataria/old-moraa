import { ReactNode, useContext } from 'react'

import { Switch, Tab, Tabs } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { TbEye, TbPencil } from 'react-icons/tb'
import { useDispatch } from 'react-redux'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { EventContextType } from '@/types/event-context.type'

function Title({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <p className="font-medium">{title}</p>
    </div>
  )
}

export function PreviewSwitcher() {
  const router = useRouter()
  const dispatch = useDispatch()

  const currentFrame = useCurrentFrame()

  const preview = useStoreSelector(
    (state) => state.event.currentEvent.eventState.isPreviewOpen
  )
  const { eventMode } = useContext(EventContext) as EventContextType
  const { permissions } = useEventPermissions()
  const searchParams = router.latestLocation.search as {
    action: string
    frameId?: string
  }

  const handlePreviewSwitcher = () => {
    dispatch(setIsPreviewOpenAction(!preview))

    router.navigate({
      search: {
        ...searchParams,
        action: preview ? 'edit' : 'view',
        frameId: currentFrame?.id,
      },
    })
  }

  useHotkeys(
    'e',
    () => {
      if (permissions.canUpdateFrame && eventMode === 'edit') {
        handlePreviewSwitcher()
      }
    },
    { enabled: permissions.canUpdateFrame },
    [(permissions.canUpdateFrame, eventMode, handlePreviewSwitcher)]
  )

  if (!permissions.canUpdateFrame) {
    return null
  }

  return (
    <Tabs
      size="sm"
      radius="full"
      keyboardActivation="manual"
      color="primary"
      selectedKey={preview ? 'view' : 'edit'}
      onSelectionChange={handlePreviewSwitcher}
      classNames={{
        tabList: 'gap-0',
        tab: 'data-[focus-visible=true]:outline-0',
      }}>
      <Tab
        key="edit"
        title={<Title icon={<TbPencil size={18} />} title="Edit" />}
      />
      <Tab
        key="view"
        title={<Title icon={<TbEye size={18} />} title="View" />}
      />
    </Tabs>
  )

  return (
    <Switch
      readOnly
      onValueChange={handlePreviewSwitcher}
      isSelected={!preview}
      size="sm"
      onChange={(e) => e.currentTarget.blur()}
      className="mr-2"
      classNames={{
        label: 'data-[focus-visible=true]:ring-0',
        wrapper: 'group-data-[focus-visible=true]:ring-0',
      }}>
      Editable
    </Switch>
  )
}
