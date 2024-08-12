import { useState } from 'react'

import { Tab, Tabs } from '@nextui-org/react'

import { FrameDetailsView } from './FrameDetailsView'
import { LeftSection } from './LeftSection/LeftSection'
import { SessionPlanner } from './SessionPlanner/SessionPlanner'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { cn } from '@/utils/utils'

export function OverviewFrame() {
  const { permissions } = useEventPermissions()

  const [selectedTab, setSelectedTab] = useState(
    permissions.canUpdateFrame ? 'agenda-planner' : 'event-info'
  )

  if (!permissions.canUpdateFrame) {
    return <FrameDetailsView />
  }

  const renderContent = () => {
    if (selectedTab === 'event-info') {
      return (
        <div className="h-full w-[800px]  scrollbar-none">
          <LeftSection />
        </div>
      )
    }

    return (
      <SessionPlanner className="sticky top-0 h-full overflow-y-scroll scrollbar-none" />
    )
  }

  return (
    <div className="p-4">
      <Tabs
        variant="underlined"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}>
        <Tab key="event-info" title="Event Info" />
        <Tab key="agenda-planner" title="Agenda Planner" />
      </Tabs>

      <div
        className={cn(
          'h-[calc(100vh_-_110px)] py-4 overflow-y-auto scrollbar-none',
          {
            'flex items-start gap-2': permissions.canUpdateFrame,
            'bg-gradient-to-b from-white to-[#e9e9d2]':
              !permissions.canUpdateFrame,
          }
        )}>
        {renderContent()}
      </div>
    </div>
  )
}
