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
import { cn } from '@/utils/utils'

const EMOJIS = [
  'heart',
  '+1',
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

  useHotkeys('e', () => setIsOpen(!isOpen), [isOpen])
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
              className: cn(
                'transition-all duration-300 bg-[#F3F4F6] text-[#444444]',
                {
                  'bg-black text-white': isOpen,
                }
              ),
            }}
            tooltipProps={{
              content: 'React with emoji',
            }}
            onClick={() => {
              setIsOpen((o) => !o)
            }}>
            <IoHappyOutline size={20} />
          </ControlButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="rounded-full overflow-hidden">
        <div className="bg-[#2C2C2C] flex items-center gap-2 py-[0.0625rem]">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              isIconOnly
              className="!opacity-100 rounded-full grid place-items-center bg-transparent hover:bg-[#4D4949] duration-300">
              <em-emoji
                set="apple"
                id={emoji}
                size={25}
                onClick={() =>
                  flyEmoji({
                    emoji,
                    name: selfParticipant.name,
                  })
                }
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
