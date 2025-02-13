import { GoSidebarCollapse } from 'react-icons/go'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { toggleLeftSidebarAction } from '@/stores/slices/layout/live.slice'
import { toggleContentStudioLeftSidebarVisibleAction } from '@/stores/slices/layout/studio.slice'
import { KeyboardShortcuts } from '@/utils/utils'

function AgendaPanelToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <Tooltip
      label={!collapsed ? 'Collapse' : 'Expand'}
      actionKey={KeyboardShortcuts['Agenda Panel'].expandAndCollapse.key}>
      <Button
        size="sm"
        isIconOnly
        className="live-button"
        variant="light"
        onClick={onToggle}>
        {!collapsed ? (
          <GoSidebarCollapse size={20} className="rotate-180" />
        ) : (
          <GoSidebarCollapse size={20} />
        )}
      </Button>
    </Tooltip>
  )
}

export function LiveAgendaPanelToggle() {
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)
  const dispatch = useStoreDispatch()

  const handleToggle = () => {
    dispatch(toggleLeftSidebarAction())
  }

  const collapsed = leftSidebarMode === 'collapsed'

  return <AgendaPanelToggle collapsed={collapsed} onToggle={handleToggle} />
}

export function StudioAgendaPanelToggle() {
  const { contentStudioLeftSidebarVisible } = useStoreSelector(
    (state) => state.layout.studio
  )
  const dispatch = useStoreDispatch()

  const handleToggle = () => {
    dispatch(toggleContentStudioLeftSidebarVisibleAction())
  }

  return (
    <AgendaPanelToggle
      collapsed={contentStudioLeftSidebarVisible}
      onToggle={handleToggle}
    />
  )
}
