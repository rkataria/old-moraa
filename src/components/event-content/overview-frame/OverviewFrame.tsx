import { useContext, useState } from 'react'

import { Button, Tab, Tabs } from '@nextui-org/react'

import { EventInfo } from './EventInfo'
import { FrameDetailsView } from './FrameDetailsView'
import { SessionPlanner } from './SessionPlanner/SessionPlanner'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { EventContext } from '@/contexts/EventContext'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function OverviewFrame() {
  const {
    preview,
    addSection,
    setOpenContentTypePicker,
    setAddedFromSessionPlanner,
    insertInSectionId,
  } = useContext(EventContext) as EventContextType

  const isAddSectionLoading = useStoreSelector(
    (state) =>
      state.event.currentEvent.sectionState.createSectionThunk.isLoading
  )

  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  const { permissions } = useEventPermissions()

  const [selectedTab, setSelectedTab] = useState(
    permissions.canUpdateFrame ? 'agenda-planner' : 'event-info'
  )

  if (!permissions.canUpdateFrame) {
    return <FrameDetailsView />
  }

  const renderContent = () => {
    if (selectedTab === 'event-info') {
      return <EventInfo />
    }

    return (
      <SessionPlanner className="sticky top-0 h-full overflow-y-scroll scrollbar-none" />
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <Tabs
          className="pl-4"
          size="sm"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}>
          <Tab key="agenda-planner" title="Agenda Planner" />
          <Tab key="event-info" title="Event Info" />
        </Tabs>
        <RenderIf isTrue={!preview}>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="solid"
              isLoading={isAddSectionLoading}
              onClick={() =>
                insertInSectionId
                  ? addSection({ afterSectionId: insertInSectionId })
                  : addSection({ addToLast: true })
              }>
              + Add Section
            </Button>
            <Button
              size="sm"
              color="primary"
              variant="ghost"
              className="border-1"
              isLoading={isAddFrameLoading}
              onClick={() => {
                setAddedFromSessionPlanner(true)
                setOpenContentTypePicker(true)
              }}>
              + Add Frame
            </Button>
          </div>
        </RenderIf>
      </div>
      <div
        className={cn(
          'h-[calc(100vh_-_126px)] py-4 overflow-y-auto scrollbar-thin',
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
