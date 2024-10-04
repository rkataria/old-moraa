import { BsGrid, BsList } from 'react-icons/bs'

import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { useAgendaPanel } from '@/hooks/useAgendaPanel'

export function ListViewToggle() {
  const { listDisplayMode, toggleListDisplayMode } = useAgendaPanel()

  return (
    <Tooltip
      label={listDisplayMode === 'list' ? 'Grid View' : 'List View'}
      actionKey={listDisplayMode === 'list' ? 'G' : 'L'}
      placement="bottom">
      <Button
        size="sm"
        variant="flat"
        isIconOnly
        onClick={toggleListDisplayMode}>
        {listDisplayMode === 'list' ? (
          <BsGrid size={16} />
        ) : (
          <BsList size={16} />
        )}
      </Button>
    </Tooltip>
  )
}
