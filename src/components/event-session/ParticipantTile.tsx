import { useRef } from 'react'

import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core'
import { motion } from 'framer-motion'
import uniqolor from 'uniqolor'

import { VideoBackgroundSettingsButtonWithModal } from './VideoBackgroundSettingsButtonWithModal'

import { useProfile } from '@/hooks/useProfile'
import { cn } from '@/utils/utils'

export function ParticipantTile({
  participant,
  handRaised = false,
}: {
  participant: DyteParticipant | Readonly<DyteSelf>
  handRaised?: boolean
}) {
  const { data: user } = useProfile()
  const tileRef = useRef<HTMLDivElement>(null)
  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const tileBgColor = uniqolor(participant.id)
  const avatarColor = uniqolor(user.id)

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
        <DyteAvatar
          size="md"
          participant={participant}
          style={{
            backgroundColor: avatarColor.color,
          }}
        />
        <DyteNameTag
          meeting={meeting}
          participant={participant}
          size="sm"
          className="left-3 w-fit">
          <DyteAudioVisualizer
            size="sm"
            slot="start"
            participant={participant}
          />
        </DyteNameTag>
        {handRaised && (
          <motion.span
            animate={{ scale: [0, 1.5, 1] }}
            className={cn(
              'absolute top-1 text-2xl flex justify-center items-center',
              {
                '!right-12': participant.id === selfParticipant.id,
                'right-3': participant.id !== selfParticipant.id,
              }
            )}>
            <em-emoji set="apple" id="hand" size={32} />
          </motion.span>

          // <HiMiniHandRaised className="absolute right-2 top-2 text-2xl flex justify-center items-center text-yellow-500" />
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
