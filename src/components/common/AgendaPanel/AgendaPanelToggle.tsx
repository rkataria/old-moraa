import { useHotkeys } from 'react-hotkeys-hook'
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
  useHotkeys(
    KeyboardShortcuts['Agenda Panel'].expandAndCollapse.key,
    onToggle,
    {
      enableOnFormTags: ['INPUT', 'TEXTAREA'],
    },
    [onToggle]
  )

  return (
    <Tooltip
      label={!collapsed ? 'Collapse' : 'Expand'}
      actionKey={KeyboardShortcuts['Agenda Panel'].expandAndCollapse.key}
      systemKeys={['ctrl']}>
      <Button size="sm" isIconOnly variant="flat" onClick={onToggle}>
        {!collapsed ? (
          <LuPanelLeftClose size={18} strokeWidth={1.2} />
        ) : (
          <LuPanelLeftOpen size={18} strokeWidth={1.2} />
        )}
      </Button>
    </Tooltip>
  )
}
