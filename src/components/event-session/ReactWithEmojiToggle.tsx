import { Key, useContext, useState } from 'react'

import { useDyteSelector } from '@dytesdk/react-web-core'
import {
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from '@heroui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoHappy, IoHappyOutline } from 'react-icons/io5'

import { ControlButton } from '../common/ControlButton'
import { RenderIf } from '../common/RenderIf/RenderIf'

import {
  EventSessionContext,
  useEventSession,
} from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn, KeyboardShortcuts, liveHotKeyProps } from '@/utils/utils'

const enum TABS {
  REACTIONS = 'reactions',
  ECHOES = 'echoes',
}

const ECHOES = [
  {
    path: '/audios/echoes/applause.mp3',
    name: 'Applause',
    emoji: 'clap',
  },
  {
    path: '/audios/echoes/buzzer.mp3',
    name: 'Buzzer',
    emoji: 'bee',
  },
  {
    path: '/audios/echoes/cartoon-trombone.mp3',
    name: 'Trombone',
    emoji: 'white_frowning_face',
  },
  {
    path: '/audios/echoes/rimshot.mp3',
    name: 'Rimshot',
    emoji: 'drum_with_drumsticks',
  },
  {
    path: '/audios/echoes/success.mp3',
    name: 'Success',
    emoji: 'pray',
  },
  {
    path: '/audios/echoes/train-bell.mp3',
    name: 'Bell',
    emoji: 'bell',
  },
]

const EMOJIS = [
  '+1',
  'sparkling_heart',
  'tada',
  'clap',
  'joy',
  'open_mouth',
  'disappointed_relieved',
  'thinking_face',
  '-1',
  'fire',
]

export function ReactWithEmojiToggle() {
  const { isHost } = useEventSession()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<Key>('reactions')

  const selfParticipant = useDyteSelector((m) => m.self)

  const { flyEmoji, sendSoundAlert } = useContext(
    EventSessionContext
  ) as EventSessionContextType

  const handleEmojiShortcut = () => {
    setIsOpen(!isOpen)
  }

  useHotkeys(KeyboardShortcuts.Live.emoji.key, handleEmojiShortcut, [
    isOpen,
    setIsOpen,
  ])

  useHotkeys('ESC', () => setIsOpen(false), [], liveHotKeyProps)

  const handleEmoji = (emojiIndex: number) => {
    flyEmoji({
      emoji: EMOJIS[emojiIndex - 1],
      name: selfParticipant.name,
    })
  }

  const handleSound = (soundIndex: number) => {
    sendSoundAlert({
      sound: ECHOES[soundIndex - 1].path,
    })
  }

  useHotkeys('r+1', () => handleEmoji(1), liveHotKeyProps)
  useHotkeys('r+2', () => handleEmoji(2), liveHotKeyProps)
  useHotkeys('r+3', () => handleEmoji(3), liveHotKeyProps)
  useHotkeys('r+4', () => handleEmoji(4), liveHotKeyProps)
  useHotkeys('r+5', () => handleEmoji(5), liveHotKeyProps)
  useHotkeys('r+6', () => handleEmoji(6), liveHotKeyProps)
  useHotkeys('r+7', () => handleEmoji(7), liveHotKeyProps)
  useHotkeys('r+8', () => handleEmoji(8), liveHotKeyProps)
  useHotkeys('r+9', () => handleEmoji(9), liveHotKeyProps)
  useHotkeys('r+0', () => handleEmoji(10), liveHotKeyProps)

  useHotkeys('e+1', () => handleSound(1), liveHotKeyProps)
  useHotkeys('e+2', () => handleSound(2), liveHotKeyProps)
  useHotkeys('e+3', () => handleSound(3), liveHotKeyProps)
  useHotkeys('e+4', () => handleSound(4), liveHotKeyProps)
  useHotkeys('e+5', () => handleSound(5), liveHotKeyProps)
  useHotkeys('e+6', () => handleSound(6), liveHotKeyProps)

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
              size: 'sm',
              variant: 'flat',
              className: cn('live-button', {
                active: isOpen,
              }),
              disableAnimation: true,
              disableRipple: true,
            }}
            tooltipProps={{
              label: KeyboardShortcuts.Live.emoji.label,
              actionKey: KeyboardShortcuts.Live.emoji.key,
            }}
            onClick={() => {
              setIsOpen((o) => !o)
            }}>
            {isOpen ? <IoHappy size={18} /> : <IoHappyOutline size={18} />}
          </ControlButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden shadow-xl bg-[#f7f7f7] pb-3 pt-0 w-[20rem]">
        {/* <EmojiPicker triggerIcon="lll" onEmojiSelect={(e) => console.log(e)} /> */}
        <div className="flex w-full flex-col bg-white pb-0 pl-2">
          <Tabs
            disableAnimation
            keyboardActivation="manual"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: 'pb-0 gap-6',
              tab: 'max-w-fit px-0 h-10 !outline-none after:w-full data-[focus-visible=true]:outline-0',
            }}
            selectedKey={selectedTab as string}
            onSelectionChange={setSelectedTab}>
            <Tab
              key={TABS.REACTIONS}
              title={
                <div className="flex items-center gap-2">
                  Reactions
                  <Kbd className="h-5 rounded-md text-xs">R</Kbd>
                </div>
              }
            />
            {isHost && (
              <Tab
                key={TABS.ECHOES}
                title={
                  <div className="flex items-center gap-2">
                    Echoes
                    <Kbd className="h-5 rounded-md text-xs">E</Kbd>
                  </div>
                }
              />
            )}
          </Tabs>
        </div>
        <div
          className={cn('grid grid-cols-5 gap-2 gap-y-2 mt-2 w-full px-2', {
            'grid-cols-2': selectedTab === TABS.ECHOES,
          })}>
          <RenderIf isTrue={selectedTab === TABS.REACTIONS}>
            {EMOJIS.map((emoji, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={emoji}
                onClick={() =>
                  flyEmoji({
                    emoji,
                    name: selfParticipant.name,
                  })
                }
                className="!opacity-100 rounded-lg grid gap-1.5 place-items-center bg-transparent hover:bg-gray-200 duration-300 w-full py-1.5 cursor-pointer bg-white">
                <em-emoji set="apple" id={emoji} size={30} />
                <Kbd className="h-4 rounded-md text-[11px]">
                  {index === 9 ? 0 : index + 1}
                </Kbd>
              </div>
            ))}
          </RenderIf>
          <RenderIf isTrue={selectedTab === TABS.ECHOES}>
            {ECHOES.map((echo, index) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={echo.path}
                onClick={() =>
                  sendSoundAlert({
                    sound: echo.path,
                  })
                }
                className="!opacity-100 rounded-lg flex gap-2 place-items-center justify-between bg-transparent hover:bg-gray-200 duration-300 w-full p-2 cursor-pointer bg-white">
                <div className="flex items-center gap-2">
                  <em-emoji set="apple" id={echo.emoji} size={18} />
                  <p className="text-xs font-medium">{echo.name}</p>
                </div>
                <Kbd className="h-4 rounded-md text-[11px]">{index + 1}</Kbd>
              </div>
            ))}
          </RenderIf>
        </div>
      </PopoverContent>
    </Popover>
  )
}
