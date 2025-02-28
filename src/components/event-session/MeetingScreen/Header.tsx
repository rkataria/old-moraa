/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useDyteMeeting } from '@dytesdk/react-web-core'
import { Divider } from '@heroui/react'
import { useParams } from '@tanstack/react-router'

import { ContentTilesLayoutDropdown } from './ContentTilesLayoutDropdown'
import { MeetingStatusBar } from './MeetingStatusBar/MeetingStatusBar'
import { SettingsToggle } from './SettingsToggle'
import { LeaveMeetingToggle } from '../LeaveMeetingToggle'
import { MeetingRecordingIndicator } from '../MeetingRecordingIndicator'

import { MoraaLogo } from '@/components/common/MoraaLogo'
import { useEvent } from '@/hooks/useEvent'
import { useStoreSelector } from '@/hooks/useRedux'

export function Header() {
  const { meeting: dyetMeeting } = useDyteMeeting()
  const { eventId } = useParams({ strict: false })
  const { event } = useEvent({ id: eventId as string })
  const meetingTitles = useStoreSelector(
    (state) =>
      state.event.currentEvent.liveSessionState.activeSession.data?.data
        ?.meetingTitles
  )

  if (!event) return null

  return (
    <div className="h-full w-full flex justify-between items-center gap-4 px-4">
      <div className="flex-1 flex justify-start items-center gap-2 h-full">
        <MoraaLogo color="primary" logoOnly className="mr-2" />
        <Divider orientation="vertical" className="h-6" />
        <div className="pr-2 pl-1 min-w-fit max-w-32 text-ellipsis line-clamp-1">
          {meetingTitles?.find((m) => m.id === dyetMeeting.meta.meetingId)
            ?.title || event.name}{' '}
        </div>
        {/* <DyteClock
          meeting={dyetMeeting}
          className="m-0 px-2 h-8 mr-2 font-thin"
        /> */}
        <MeetingRecordingIndicator />
      </div>
      <div className="flex-auto">
        <MeetingStatusBar />
      </div>
      <div className="flex-1 flex justify-end items-center gap-2 h-full">
        <div className="flex justify-center items-center gap-2 p-2 h-11 rounded-[12px] border-1 border-gray-300 bg-white">
          <ContentTilesLayoutDropdown />
          <SettingsToggle />
          <LeaveMeetingToggle showLabel />
        </div>
      </div>
    </div>
  )
}
