import { useRef } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { HiMiniHandRaised } from 'react-icons/hi2'
import uniqolor from 'uniqolor'

import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'

import { cn } from '@/utils/utils'

export function ParticipantTile({
  participant,
  handRaised = false,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  handRaised?: boolean
}) {
  const tileRef = useRef<HTMLDivElement>(null)
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const tileBgColor = uniqolor(participant.id)

  return (
    <div
      ref={tileRef}
      className={cn(
        'participant-grid w-full h-full m-auto flex items-center justify-center overflow-hidden'
      )}>
      <DyteParticipantTile
        meeting={meeting}
        participant={participant}
        nameTagPosition="bottom-right"
        className="w-full h-full aspect-video"
        style={{
          backgroundColor: tileBgColor.color,
        }}>
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
        {handRaised && (
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
  )
}
