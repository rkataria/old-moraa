import { Tab, Tabs } from '@heroui/react'
import { BsGrid, BsList } from 'react-icons/bs'

import { Tooltip } from '../ShortuctTooltip'

import { useAgendaPanel } from '@/hooks/useAgendaPanel'
import { KeyboardShortcuts } from '@/utils/utils'

export function ListViewToggle() {
  const { listDisplayMode, toggleListDisplayMode } = useAgendaPanel()

  return (
    <Tabs
      selectedKey={listDisplayMode}
      keyboardActivation="manual"
      onSelectionChange={() => toggleListDisplayMode()}
      size="sm"
      classNames={{
        tabList: 'p-0 border gap-0 bg-white h-8 bg-gray-100 p-[4px] rounded-lg',
        cursor: 'w-full bg-primary-100 rounded bg-white',
        tab: 'p-0 w-6 h-6 data-[focus-visible=true]:outline-0',
        tabContent: 'w-full h-full',
      }}>
      <Tab
        key="grid"
        title={
          <Tooltip
            label={KeyboardShortcuts['Agenda Panel'].grid.label}
            actionKey={KeyboardShortcuts['Agenda Panel'].grid.key}>
            <div className="h-full grid place-items-center">
              <BsGrid size={12} />
            </div>
          </Tooltip>
        }
      />
      <Tab
        key="list"
        title={
          <Tooltip
            label={KeyboardShortcuts['Agenda Panel'].list.label}
            actionKey={KeyboardShortcuts['Agenda Panel'].list.key}>
            <div className="h-full grid place-items-center">
              <BsList size={12} />
            </div>
          </Tooltip>
        }
      />
    </Tabs>
  )
}
