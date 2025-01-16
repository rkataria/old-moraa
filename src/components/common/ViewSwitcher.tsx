import { Tab, Tabs } from '@nextui-org/react'
import { BsGrid, BsList } from 'react-icons/bs'

export type ViewTypes = 'grid' | 'list'

export function ViewSwitcher({
  currentView,
  onViewChange,
}: {
  onViewChange: (view: string) => void
  currentView: string
}) {
  return (
    <Tabs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelectionChange={onViewChange as any}
      selectedKey={currentView}
      size="sm"
      classNames={{
        tabList: 'p-0 border gap-0 bg-white',
        cursor: 'w-full bg-primary-100 rounded-none',
        tabContent: 'group-data-[selected=true]:text-primary',
        tab: 'p-2.5',
      }}>
      <Tab key="grid" title={<BsGrid size={16} />} />
      <Tab key="list" title={<BsList size={16} />} />
    </Tabs>
  )
}
