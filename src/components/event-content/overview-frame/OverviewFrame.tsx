import { ReactNode, useContext, useState } from 'react'

import { Button, Tab, Tabs } from '@nextui-org/react'
import { useParams } from '@tanstack/react-router'
import { MdAdd, MdFormatListBulletedAdd } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'
import { TfiAgenda } from 'react-icons/tfi'

import { EventInfo } from './EventInfo'
import { FrameDetailsView } from './FrameDetailsView'
import { SessionPlanner } from './SessionPlanner/SessionPlanner'

import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { ThemeEffects } from '@/components/events/ThemeEffects'
import { EventContext } from '@/contexts/EventContext'
import { useEvent } from '@/hooks/useEvent'
import { useEventPermissions } from '@/hooks/useEventPermissions'
import { useStoreSelector } from '@/hooks/useRedux'
import { EventType } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

function ContentWrapper({
  children,
  permissions,
  className = '',
}: {
  children: ReactNode
  permissions: { canUpdateFrame: boolean }
  className?: string
}) {
  return (
    <div
      className={cn(
        'h-[calc(100vh_-126px)] py-4 overflow-y-auto scrollbar-thin',
        className,
        {
          'flex items-start gap-2': permissions.canUpdateFrame,
        }
      )}>
      {children}
    </div>
  )
}

export function OverviewFrame() {
  const {
    preview,
    addSection,
    setOpenContentTypePicker,
    setAddedFromSessionPlanner,
    insertInSectionId,
  } = useContext(EventContext) as EventContextType
  const { eventId } = useParams({ strict: false })
  const eventData = useEvent({ id: eventId! })

  const { event } = eventData
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
    return <FrameDetailsView className="pl-8" />
  }

  const renderContent = () => {
    if (selectedTab === 'event-info') {
      return preview ? (
        <FrameDetailsView className="pl-[10%]" />
      ) : (
        <ThemeEffects selectedTheme={event.theme}>
          <ContentWrapper
            permissions={permissions}
            className={cn('px-[10%]', {
              '!h-[calc(100vh_-_148px)]': !preview,
            })}>
            <EventInfo />
          </ContentWrapper>
        </ThemeEffects>
      )
    }

    return (
      <ContentWrapper permissions={permissions} className="px-[10%]">
        <SessionPlanner className="sticky top-0 h-full overflow-y-scroll scrollbar-none" />
      </ContentWrapper>
    )
  }

  const tabLabelInPreview = {
    [EventType.COURSE]: 'Agenda',
    [EventType.WEBINAR]: 'Session Outline',
    [EventType.WORKSHOP]: 'Activity Guide',
  }

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="flex items-center justify-between px-[10%]">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList:
              'gap-8 w-full relative rounded-none p-0 border-b border-divider',
            tab: 'max-w-fit px-0 h-12 font-semibold',
            cursor: 'w-full h-[3px]',
            tabContent: 'group-data-[selected=true]:text-primary',
            base: '',
          }}>
          <Tab
            key="agenda-planner"
            title={
              <div className="flex items-center space-x-2">
                <TfiAgenda size={20} />
                <span>
                  {preview
                    ? [tabLabelInPreview[event.type as EventType]]
                    : `Plan your ${event.type}`}
                </span>
              </div>
            }
          />
          <Tab
            key="event-info"
            title={
              <div className="flex items-center space-x-2">
                <TbListDetails size={20} />
                <span>{preview ? 'Overview' : 'Build overview page'}</span>
              </div>
            }
          />
        </Tabs>

        <RenderIf isTrue={!preview && selectedTab !== 'event-info'}>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="solid"
              isLoading={isAddSectionLoading}
              startContent={<MdFormatListBulletedAdd size={22} />}
              onClick={() =>
                insertInSectionId
                  ? addSection({ afterSectionId: insertInSectionId })
                  : addSection({ addToLast: true })
              }>
              Add Section
            </Button>
            <Button
              size="sm"
              color="primary"
              variant="ghost"
              className="border-1"
              isLoading={isAddFrameLoading}
              startContent={<MdAdd size={24} />}
              onClick={() => {
                setAddedFromSessionPlanner(true)
                setOpenContentTypePicker(true)
              }}>
              Add Frame
            </Button>
          </div>
        </RenderIf>
      </div>

      {renderContent()}
    </div>
  )
}
