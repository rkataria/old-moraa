import { useContext, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import { IoHappy } from 'react-icons/io5'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

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
              variant: 'flat',
              className: cn('transition-all duration-300', {
                'bg-black text-white': isOpen,
              }),
            }}
            tooltipProps={{
              content: 'React with emoji',
            }}
            onClick={() => {
              setIsOpen((o) => !o)
            }}>
            <IoHappy size={20} />
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
