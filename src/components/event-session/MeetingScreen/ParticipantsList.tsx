import { Dispatch, SetStateAction, useState } from 'react'

import { DyteAvatar } from '@dytesdk/react-ui-kit'
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core'
import { DyteParticipant } from '@dytesdk/web-core'
import { Accordion, AccordionItem, Input, useDisclosure } from '@heroui/react'
import { ReactNode } from '@tanstack/react-router'
import clsx from 'clsx'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { BsCameraVideo, BsFillCameraVideoOffFill } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import {
  IoEllipsisVerticalOutline,
  IoHandRightOutline,
  IoMicOff,
  IoMicOutline,
} from 'react-icons/io5'
import { VscPinned } from 'react-icons/vsc'

import { AddParticipantsButtonWithModal } from '@/components/common/AddParticipantsButtonWithModal'
import { ControlButton } from '@/components/common/ControlButton'
import { DropdownActions } from '@/components/common/DropdownActions'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useDyteParticipants } from '@/hooks/useDyteParticipants'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { updateMeetingSessionDataAction } from '@/stores/slices/event/current-event/live-session.slice'
import { cn, getUniqueColor } from '@/utils/utils'

function Listing({
  children,
  title,
}: {
  children: ReactNode
  title: string | ReactNode
}) {
  return (
    <Accordion defaultSelectedKeys={['1']}>
      <AccordionItem
        hideIndicator
        key="1"
        title={title}
        classNames={{
          title: 'text-sm font-medium',
          trigger: '!outline-none',
          content: 'mb-6 pt-0',
        }}>
        {children}
      </AccordionItem>
    </Accordion>
  )
}

function Container({ children }: { children: ReactNode }) {
  return <div className="grid gap-[18px]">{children}</div>
}

function ParticipantItem({
  participant,
  rightActions,
  showReactions = false,
}: {
  participant: Omit<
    DyteParticipant,
    'audioTrack' | 'videoTrack' | 'screenShareTracks'
  >
  rightActions?: ReactNode
  showReactions?: boolean
}) {
  const reactions = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.reactions
  )

  const reaction = reactions
    ?.filter((r) => r.participantId === participant.id)
    ?.slice(-1)[0]

  const { meeting } = useDyteMeeting()
  const selfParticipant = useDyteSelector((m) => m.self)
  const presenceColor = getUniqueColor(
    participant.customParticipantId as string,
    { lightness: undefined }
  )
  const selfPresenceColor = getUniqueColor(
    selfParticipant?.customParticipantId as string,
    { lightness: undefined }
  )

  const isSelfTile = participant.id === selfParticipant.id

  const ACTIONS = [
    {
      key: 'pin',
      label: participant.isPinned ? 'Unpin' : 'Pin',
      icon: '',
    },
    {
      key: 'kick',
      label: 'Kick off',
      icon: '',
    },
    {
      key: 'mute',
      label: 'Mute',
      icon: '',
      hide: !participant.audioEnabled,
    },
  ]

  const validActions = ACTIONS.filter((action) => !action?.hide)

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="relative">
          <DyteAvatar
            size="sm"
            participant={participant}
            className="!w-7 !h-7 w-full h-full text-sm aspect-square"
            style={{
              backgroundColor: isSelfTile ? selfPresenceColor : presenceColor,
              width: 'auto',
            }}
          />
          {participant.isPinned && (
            <Button
              isIconOnly
              className="absolute right-0 -bottom-1 min-w-5 w-5 h-5 rounded-full border-white border-2"
              size="sm">
              <VscPinned size={16} />
            </Button>
          )}
        </div>

        <div>
          <p className="text-xs break-words">
            {participant.name}
            {meeting?.self.id === participant?.id ? ' (You)' : null}
          </p>

          <RenderIf isTrue={participant.presetName === 'group_call_host'}>
            <p className="text-[10px]">Host</p>
          </RenderIf>
        </div>
      </div>

      <RenderIf isTrue={!rightActions}>
        <div className="min-w-fit flex items-center">
          <RenderIf isTrue={!!reaction && showReactions}>
            <em-emoji set="apple" id={reaction?.reaction} size={20} />
          </RenderIf>

          <ControlButton
            buttonProps={{
              isIconOnly: true,
              size: 'sm',
              radius: 'md',
              variant: 'flat',
              className: cn('live-button', {
                '!text-red-500 hover:!text-red-500': !participant.audioEnabled,
              }),
              disableAnimation: true,
              disableRipple: true,
            }}
            onClick={() => {
              participant.disableAudio()
            }}>
            {participant.audioEnabled ? (
              <IoMicOutline size={18} />
            ) : (
              <IoMicOff size={18} />
            )}
          </ControlButton>

          <ControlButton
            buttonProps={{
              isIconOnly: true,
              radius: 'md',
              size: 'sm',
              variant: 'flat',
              className: cn('live-button', {
                '!text-red-500 hover:!text-red-500': !participant.videoEnabled,
              }),
              disableAnimation: true,
              disableRipple: true,
            }}
            onClick={() => {
              participant.disableVideo()
            }}>
            {participant.videoEnabled ? (
              <BsCameraVideo size={18} />
            ) : (
              <BsFillCameraVideoOffFill size={18} />
            )}
          </ControlButton>
          <RenderIf
            isTrue={meeting.self.permissions.canDisableParticipantAudio}>
            <DropdownActions
              triggerIcon={
                <Button
                  isIconOnly
                  variant="light"
                  className="-mr-2.5 !bg-transparent">
                  <IoEllipsisVerticalOutline size={16} />
                </Button>
              }
              actions={validActions}
              onAction={(actionKey) => {
                if (actionKey === 'mute') {
                  if (participant.audioEnabled) {
                    participant.disableAudio()

                    return
                  }
                }
                if (actionKey === 'kick') {
                  meeting.participants.kick(participant.id)
                }
                if (actionKey === 'pin') {
                  if (participant.isPinned) {
                    participant.unpin()

                    return
                  }
                  participant.pin()
                }
              }}
            />
          </RenderIf>
        </div>
      </RenderIf>
      {rightActions || null}
    </div>
  )
}

function ActiveParticipants({ search }: { search: string }) {
  const { sortedParticipants } = useDyteParticipants()
  const { meeting } = useDyteMeeting()

  const muteAll = async () => {
    await meeting?.participants.disableAllAudio(true)
  }

  const filteredParticipants = search
    ? sortedParticipants.filter((p) => p.name.toLowerCase().includes(search))
    : sortedParticipants

  return (
    <Listing
      title={
        <div className="flex items-center justify-between">
          <p>All participants ({sortedParticipants.length})</p>
          <RenderIf
            isTrue={meeting.self.permissions.canDisableParticipantAudio}>
            <Button
              size="sm"
              variant="light"
              onClick={muteAll}
              className="text-xs -mr-2.5">
              Mute all
            </Button>
          </RenderIf>
        </div>
      }>
      <Container>
        {filteredParticipants.map((participant) => (
          <ParticipantItem participant={participant} showReactions />
        ))}
      </Container>
    </Listing>
  )
}

function RaisedHandParticipants({ search }: { search: string }) {
  const { isHost } = useEventSession()
  const { handRaisedActiveParticipants } = useDyteParticipants()
  const dispatch = useStoreDispatch()

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const filteredHandRaisedParticipants = search
    ? handRaisedActiveParticipants.filter((p) =>
        p.name.toLowerCase().includes(search)
      )
    : handRaisedActiveParticipants

  if (!handRaisedActiveParticipants.length) return null

  return (
    <Listing title={`Raised Hands (${handRaisedActiveParticipants.length})`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400">First to last</p>
        <RenderIf isTrue={isHost}>
          <Button
            size="sm"
            variant="light"
            className="text-xs -mr-2.5"
            onClick={() => {
              dispatch(
                updateMeetingSessionDataAction({
                  handsRaised: [],
                })
              )
            }}>
            Lower all
          </Button>
        </RenderIf>
      </div>

      <Container>
        {filteredHandRaisedParticipants.map((participant) => (
          <ParticipantItem
            participant={participant}
            rightActions={
              <>
                <RenderIf isTrue={!isHost}>
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    isDisabled
                    disableRipple>
                    <IoHandRightOutline size={20} />
                  </Button>
                </RenderIf>
                <RenderIf isTrue={isHost}>
                  <Button
                    size="sm"
                    variant="light"
                    className="text-xs -mr-2.5"
                    onClick={() => {
                      dispatch(
                        updateMeetingSessionDataAction({
                          handsRaised: session?.data?.handsRaised?.filter(
                            (pId) => pId !== participant.id
                          ),
                        })
                      )
                    }}>
                    Lower
                  </Button>
                </RenderIf>
              </>
            }
          />
        ))}
      </Container>
    </Listing>
  )
}

function WaitListedParticipants({ search }: { search: string }) {
  const { isHost } = useEventSession()
  const { meeting } = useDyteMeeting()
  const { waitlistedParticipants } = useDyteParticipants()

  const areParticipantsWaitingInLobby = useDyteSelector(
    (state) => !!state.participants.waitlisted.size
  )

  const acceptWaitingRoomRequest = async (id: string) => {
    await meeting.participants.acceptWaitingRoomRequest(id)
  }

  const acceptAllWaitingRoomRequests = async () => {
    const ids = waitlistedParticipants.map((p) => p.id)
    if (ids.length === 0) return
    await meeting.participants.acceptAllWaitingRoomRequest(ids)
  }

  const rejectWaitingRoomRequest = async (id: string) => {
    await meeting.participants.rejectWaitingRoomRequest(id)
  }

  const rejectAllWaitingRoomRequests = async () => {
    await Promise.all(
      waitlistedParticipants.map((participant) =>
        meeting.participants.rejectWaitingRoomRequest(participant.id)
      )
    )
  }

  const filteredParticipants = search
    ? waitlistedParticipants.filter((p) =>
        p.name.toLowerCase().includes(search)
      )
    : waitlistedParticipants

  if (!areParticipantsWaitingInLobby) return null

  return (
    <Listing title={`Waiting Room (${waitlistedParticipants.length})`}>
      <RenderIf isTrue={isHost}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="light"
              className="text-xs font-medium"
              onClick={rejectAllWaitingRoomRequests}>
              Deny All
            </Button>
            <Button
              size="sm"
              color="primary"
              className="text-xs font-medium"
              onClick={acceptAllWaitingRoomRequests}>
              Accept All
            </Button>
          </div>
        </div>
      </RenderIf>

      <Container>
        {filteredParticipants.map((participant) => (
          <ParticipantItem
            participant={participant}
            rightActions={
              <div className="flex items-center gap-0.5">
                <Button
                  size="sm"
                  variant="light"
                  className="text-xs font-medium"
                  onClick={() => rejectWaitingRoomRequest(participant.id)}>
                  Deny
                </Button>

                <Button
                  size="sm"
                  color="primary"
                  variant="bordered"
                  className="border-1 text-xs font-medium border-gray-300"
                  onClick={() => acceptWaitingRoomRequest(participant.id)}>
                  Accept
                </Button>
              </div>
            }
          />
        ))}
      </Container>
    </Listing>
  )
}

function ParticipantFilter({
  search,
  onSearch,
}: {
  search: string
  onSearch: Dispatch<SetStateAction<string>>
}) {
  const inviteParticipantsDiscloure = useDisclosure()
  const { isHost } = useEventSession()

  return (
    <>
      <div className="flex items-center gap-1">
        <Input
          startContent={<CiSearch size={20} />}
          size="sm"
          type="text"
          variant="bordered"
          classNames={{
            inputWrapper:
              'border-1 rounded-lg !border-gray-300 shadow-none !outline-none',
            input: 'outline-none',
          }}
          placeholder="Search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <RenderIf isTrue={isHost}>
          <Button
            variant="bordered"
            isIconOnly
            className="border-1 !border-gray-300 rounded-lg min-w-8 w-8 h-8"
            onClick={() => inviteParticipantsDiscloure.onOpen()}>
            <AiOutlineUserAdd size={18} className="text-gray-600" />
          </Button>
        </RenderIf>
      </div>
      <AddParticipantsButtonWithModal
        showLabel={false}
        disclosure={inviteParticipantsDiscloure}
      />
    </>
  )
}

export function ParticipantsList({ className }: { className?: string }) {
  const [search, setSearch] = useState('')

  return (
    <div className={clsx('flex flex-col gap-0', className)}>
      <ParticipantFilter search={search} onSearch={setSearch} />
      <WaitListedParticipants search={search} />
      <RaisedHandParticipants search={search} />
      <ActiveParticipants search={search} />
    </div>
  )
}
