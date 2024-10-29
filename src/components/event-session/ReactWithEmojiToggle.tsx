import { useContext, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoHappyOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, KeyboardShortcuts } from '@/utils/utils'

const EMOJIS = [
  '+1',
  'heart',
  'tada',
  'clap',
  'joy',
  'open_mouth',
  'disappointed_relieved',
  'thinking_face',
  '-1',
]

export function ReactWithEmojiToggle() {
  const [isOpen, setIsOpen] = useState(false)

  const selfParticipant = useDyteSelector((m) => m.self)

  const { flyEmoji } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiShortcut = (e: any) => {
    if (e.target.localName.includes('dyte-sidebar')) return
    setIsOpen(!isOpen)
  }

  useHotkeys(KeyboardShortcuts.Live.emoji.key, handleEmojiShortcut, [
    isOpen,
    setIsOpen,
  ])

  useHotkeys('ESC', () => setIsOpen(false), [])

  const handleEmoji = (emojiIndex: number) => {
    if (!isOpen) return
    flyEmoji({
      emoji: EMOJIS[emojiIndex - 1],
      name: selfParticipant.name,
    })
  }

  useHotkeys('1', () => handleEmoji(1))
  useHotkeys('2', () => handleEmoji(2))
  useHotkeys('3', () => handleEmoji(3))
  useHotkeys('4', () => handleEmoji(4))
  useHotkeys('5', () => handleEmoji(5))
  useHotkeys('6', () => handleEmoji(6))
  useHotkeys('7', () => handleEmoji(7))
  useHotkeys('8', () => handleEmoji(8))
  useHotkeys('9', () => handleEmoji(9))

  return (
    <Popover
      offset={15}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{ content: 'p-0' }}>
      <PopoverTrigger>
        <div>
          <ControlButton
            buttonProps={{
              isIconOnly: true,
              radius: 'md',
              size: 'sm',
              variant: 'flat',
              className: cn('live-button', {
                active: isOpen,
              }),
            }}
            tooltipProps={{
              label: KeyboardShortcuts.Live.emoji.label,
              actionKey: KeyboardShortcuts.Live.emoji.key,
            }}
            onClick={() => {
              setIsOpen((o) => !o)
            }}>
            <IoHappyOutline size={20} />
          </ControlButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="rounded-full overflow-hidden shadow-xl">
        <div className="bg-gray-100 flex items-center gap-2 py-[0.0625rem]">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              isIconOnly
              onClick={() =>
                flyEmoji({
                  emoji,
                  name: selfParticipant.name,
                })
              }
              className="!opacity-100 rounded-full grid place-items-center bg-transparent hover:bg-gray-200 duration-300">
              <em-emoji set="apple" id={emoji} size={25} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
