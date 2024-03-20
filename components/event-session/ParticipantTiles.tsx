import React, { useContext } from 'react'

import {
  DyteAudioVisualizer,
  DyteNameTag,
  DyteParticipantTile,
  DyteSpotlightGrid,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { HiMiniHandRaised } from 'react-icons/hi2'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function ParticipantTiles({
  spotlightMode,
  sidebarVisible,
}: {
  spotlightMode: boolean
  sidebarVisible: boolean
}) {
  const { meeting } = useDyteMeeting()
  const { activeStateSession } = useContext(
    EventSessionContext
  ) as EventSessionContextType
  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  )
  const selfParticipant = useDyteSelector((m) => m.self)
  const hostParticipant = activeParticipants?.find((p) =>
    p.presetName?.includes('host')
  )
  const activeParticipantsExceptHost = activeParticipants?.filter(
    (p) => p.id !== hostParticipant?.id
  )

  if (spotlightMode) {
    return (
      <div className="flex-auto flex justify-center items-center h-full">
        <DyteSpotlightGrid
          meeting={meeting}
          layout="row"
          participants={[...activeParticipantsExceptHost, selfParticipant]}
          pinnedParticipants={[hostParticipant || selfParticipant]}
          style={{ height: '80%', width: '100%' }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden overflow-x-auto flex gap-2 flex-nowrap scrollbar-none p-2 -mt-[2px]',
        {
          'flex-col': !sidebarVisible,
          'flex-row justify-start items-center h-full': sidebarVisible,
        }
      )}>
      <DyteParticipantTile
        meeting={meeting}
        participant={selfParticipant}
        nameTagPosition="bottom-right"
        variant="gradient"
        className={cn('relative aspect-video flex-none z-[1]', {
          'w-full flex-col': !sidebarVisible,
          'h-full flex-row': sidebarVisible,
        })}>
        <DyteNameTag
          meeting={meeting}
          participant={selfParticipant}
          className="left-1/2 -translate-x-1/2">
          <DyteAudioVisualizer slot="start" participant={selfParticipant} />
        </DyteNameTag>
        {activeStateSession?.data?.handsRaised?.includes(
          selfParticipant.id
        ) && (
          <HiMiniHandRaised className="absolute right-2 top-2 text-xl animate-pulse flex justify-center items-center text-[#FAC036]" />
        )}
      </DyteParticipantTile>
      <div
        className={cn('gap-2', {
          'grid grid-cols-2': !sidebarVisible,
          'flex flex-row justify-start items-center h-full gap-2':
            sidebarVisible,
        })}>
        {activeParticipants?.map((participant) => (
          <DyteParticipantTile
            meeting={meeting}
            participant={participant}
            nameTagPosition="bottom-right"
            variant="gradient"
            className={cn('flex-none !aspect-square relative z-[1]', {
              'w-full h-auto': !sidebarVisible,
              'h-full': sidebarVisible,
            })}>
            <DyteNameTag
              meeting={meeting}
              participant={participant}
              size="sm"
              className="left-1/2 -translate-x-1/2">
              <DyteAudioVisualizer
                size="sm"
                slot="start"
                participant={participant}
              />
            </DyteNameTag>
            {activeStateSession?.data?.handsRaised?.includes(
              participant.id
            ) && (
              <HiMiniHandRaised className="absolute right-2 top-2 text-2xl flex justify-center items-center text-[#FAC036]" />
            )}
          </DyteParticipantTile>
        ))}
      </div>
    </div>
  )
}
