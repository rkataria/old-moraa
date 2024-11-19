import { IoSettings, IoSettingsOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { cn } from '@/utils/utils'

export function FrameSettingsToggleButton() {
  const dispatch = useDispatch()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )

  const toggleSidebar = () => {
    dispatch(
      setContentStudioRightSidebarAction(
        contentStudioRightSidebar === 'frame-settings' ? null : 'frame-settings'
      )
    )
  }

  const isVisible = contentStudioRightSidebar === 'frame-settings'

  return (
    <Tooltip label="Frame Settings" placement="left">
      <Button
        size="sm"
        isIconOnly
        className={cn('bg-transparent', {
          'text-primary': isVisible,
        })}
        onClick={toggleSidebar}>
        {isVisible ? <IoSettings size={20} /> : <IoSettingsOutline size={20} />}
      </Button>
    </Tooltip>
  )
}
