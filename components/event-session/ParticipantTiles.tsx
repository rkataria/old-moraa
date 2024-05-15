import React, { useContext } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
  DyteSpotlightGrid,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { HiMiniHandRaised } from 'react-icons/hi2'

import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function ParticipantTiles({
  spotlightMode,
  panelSize,
}: {
  spotlightMode: boolean
  panelSize: number
}) {
  const { meeting } = useDyteMeeting()
  const { activeSession } = useContext(
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
    <div className="overflow-auto scrollbar-none h-full p-4">
      <div
        className={cn(
          'flex gap-0 w-full justify-center items-center h-full content-center',
          {
            'flex-col flex-nowrap':
              panelSize <= 30 || activeParticipants.length < 3,
            'flex-row flex-wrap':
              activeParticipants.length > 2 &&
              (panelSize > 30 ||
                (activeParticipants.length > 3 && panelSize > 23)),
          }
        )}>
        {[...activeParticipants, selfParticipant]?.map((participant) => (
          <div
            key={participant.id}
            className={cn('relative flex-none z-[1] w-full aspect-video p-2', {
              'w-4/5':
                (activeParticipants.length === 1 && panelSize > 44) ||
                (activeParticipants.length === 2 && panelSize > 30) ||
                (activeParticipants.length === 3 && panelSize > 23),
              'w-1/2':
                (panelSize > 30 && activeParticipants.length > 2) ||
                (activeParticipants.length > 3 && panelSize > 22),
              'w-1/3': panelSize > 50 && activeParticipants.length > 2,
              'w-3/5': activeParticipants.length === 2 && panelSize > 35,
            })}>
            <DyteParticipantTile
              meeting={meeting}
              participant={participant}
              nameTagPosition="bottom-right"
              // variant="gradient"
              className="h-full w-full">
              <DyteAvatar size="md" participant={participant} />
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
              {activeSession?.data?.handsRaised?.includes(participant.id) && (
                <HiMiniHandRaised className="absolute right-2 top-2 text-2xl flex justify-center items-center text-[#FAC036]" />
              )}
              {participant.id === selfParticipant.id && (
                <VideoBackgroundSettingsButtonWithModal
                  buttonProps={{
                    className: 'absolute top-2 right-2 w-8 h-8 flex-none',
                  }}
                />
              )}
            </DyteParticipantTile>
          </div>
        ))}
      </div>
    </div>
  )
}
