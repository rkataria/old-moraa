'use client'

import React from 'react'

import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'

export function BreakoutRoomStatus() {
  const dyteMeetingSelector = useDyteSelector((m) => m)
  const { meeting: dyteMeeting } = useDyteMeeting()

  const isDyteBreakoutRoom =
    dyteMeetingSelector.connectedMeetings.parentMeeting &&
    dyteMeetingSelector.connectedMeetings.parentMeeting.id !==
      dyteMeeting.meta.meetingId

  const message = isDyteBreakoutRoom
    ? `In breakout room: ${dyteMeeting.meta.meetingTitle}`
    : 'In main room'

  return (
    <div className="fixed bottom-2 right-2 py-2 px-4 flex justify-center items-center gap-2 bg-white rounded-full shadow-sm">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-semibold">{message}</span>
    </div>
  )
}
