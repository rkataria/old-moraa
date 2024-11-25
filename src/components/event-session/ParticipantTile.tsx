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
import ResizeObserver from 'rc-resize-observer'
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
  const presenceColor = uniqolor(
    participant.customParticipantId as string
  )?.color
  const selfPresenceColor = uniqolor(
    selfParticipant?.customParticipantId as string
  )?.color

  const isSelfTile = participant.id === selfParticipant.id

  return (
    <div
      ref={tileRef}
      className={cn(
        'participant-grid w-full h-full m-auto flex items-center justify-center overflow-hidden'
      )}>
      <ResizeObserver
        onResize={({ width, height }, element) => {
          const aspectRatio = width / height

          // Maintain aspect ratio so that the height is always 2.25 times the width and it doesn't look like it's squished
          if (aspectRatio > 2.25) {
            element.style.width = `${height * 2.25}px`
          }
        }}>
        <DyteParticipantTile
          meeting={meeting}
          participant={participant}
          nameTagPosition="bottom-right"
          className="w-full h-full aspect-video bg-[var(--dyte-participant-tile-bg-color)]">
          <DyteAvatar
            size="md"
            participant={participant}
            className="min-w-12 min-h-12 max-w-28 max-h-28 w-full h-full text-lg"
            style={{
              backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
            }}
          />
          <DyteNameTag
            meeting={meeting}
            participant={participant}
            size="sm"
            className="left-3 w-fit text-white"
            style={{
              backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
            }}>
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
          )}
          {participant.id === selfParticipant.id && (
            <VideoBackgroundSettingsButtonWithModal
              buttonProps={{
                className: 'absolute top-2 right-2 w-8 h-8 flex-none',
              }}
            />
          )}
        </DyteParticipantTile>
      </ResizeObserver>
    </div>
  )
}
