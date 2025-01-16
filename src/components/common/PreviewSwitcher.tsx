import { useContext } from 'react'

import { Switch } from '@nextui-org/react'
import { useRouter } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'

import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { useCurrentFrame } from '@/stores/hooks/useCurrentFrame'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className={cn(
        'flex items-center gap-1 h-7 p-2 rounded-md cursor-pointer',
        {
          active: !preview,
        }
      )}
      onClick={handlePreviewSwitcher}>
      <Switch
        readOnly
        onValueChange={handlePreviewSwitcher}
        isSelected={!preview}
        size="sm"
        classNames={{
          base: 'data-[selected=true]:border-primary gap-0.5',
        }}>
        <p className="text-default-600">Editable</p>
      </Switch>
    </div>
  )
}
