import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { KeyboardShortcuts } from '@/utils/utils'

export function AgendaPanelToggle({
  collapsed = false,
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
          <LuPanelLeftClose size={20} strokeWidth={1.2} />
        ) : (
          <LuPanelLeftOpen size={20} strokeWidth={1.2} />
        )}
      </Button>
    </Tooltip>
  )
}
