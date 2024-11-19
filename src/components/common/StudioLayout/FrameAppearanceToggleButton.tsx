import { HiColorSwatch, HiOutlineColorSwatch } from 'react-icons/hi'
import { useDispatch } from 'react-redux'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightSidebarAction } from '@/stores/slices/layout/studio.slice'
import { cn } from '@/utils/utils'

export function FrameAppearanceToggleButton() {
  const dispatch = useDispatch()
  const { contentStudioRightSidebar } = useStoreSelector(
    (state) => state.layout.studio
  )

  const toggleSidebar = () => {
    dispatch(
      setContentStudioRightSidebarAction(
        contentStudioRightSidebar === 'frame-appearance'
          ? null
          : 'frame-appearance'
      )
    )
  }

  const isVisible = contentStudioRightSidebar === 'frame-appearance'

  return (
    <Tooltip label="Frame Appearance" placement="top">
      <Button
        size="sm"
        isIconOnly
        className={cn('bg-transparent', {
          'text-primary': isVisible,
        })}
        onClick={toggleSidebar}>
        {isVisible ? (
          <HiColorSwatch size={18} />
        ) : (
          <HiOutlineColorSwatch size={18} />
        )}
      </Button>
    </Tooltip>
  )
}
