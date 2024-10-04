/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import 'tldraw/tldraw.css'

import { useContext, useRef, useState } from 'react'

import { Button, Card } from '@nextui-org/react'
import { HiOutlinePlus } from 'react-icons/hi2'
import { v4 as uuidv4 } from 'uuid'

// eslint-disable-next-line import/no-cycle
import { BreakoutRoomActivityCard } from './BreakoutActivityCard'
import { BreakoutFrameThumbnailCard } from './BreakoutFrameThumbnainCard'
import { DeleteBreakoutRoomModal } from './DeleteBreakoutRoomModal'
import { BREAKOUT_TYPES } from '../BreakoutTypePicker'
import { ContentType, ContentTypePicker } from '../ContentTypePicker'
import { DeleteFrameModal } from '../DeleteFrameModal'
import { RenderIf } from '../RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { useDimensions } from '@/hooks/useDimensions'
import { useStoreSelector } from '@/hooks/useRedux'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent } from '@/utils/content.util'

// eslint-disable-next-line import/no-cycle

export type BreakoutFrame = IFrame & {
  content: {
    title: string
    description: string
    breakoutType: string
    countOfRoomsGroups: number
  }
}

interface BreakoutProps {
  frame: BreakoutFrame
  isEditable?: boolean
}

export function BreakoutFrame({ frame, isEditable = false }: BreakoutProps) {
  const {
    isOwner,
    preview,
    currentFrame,
    sections,
    insertInSectionId,
    addFrameToSection,
    setCurrentFrame,
    updateFrame,
    deleteFrame,
    getFrameById,
    eventMode,
  } = useContext(EventContext) as EventContextType
  const isMeetingJoined = useStoreSelector(
    (state) => state.event.currentEvent.liveSessionState.dyte.isMeetingJoined
  )

  const editable = isOwner && !preview && isEditable

  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const { width: containerWidth } = useDimensions(
    thumbnailContainerRef,
    'maximized'
  )

  const [deletingRoomIndex, setDeletingRoomIndex] = useState(-1)
  const [deletingActivityFrameIndex, setDeletingActivityFrameIndex] =
    useState(-1)
  const [addingActivityRoomIndex, setAddingActivityRoomIndex] =
    useState<number>(0)
  const [openContentTypePicker, setOpenContentTypePicker] =
    useState<boolean>(false)

  const handleAddNewFrame = (
    contentType: ContentType,
    templateKey?: string
  ): void => {
    let currentSection
    const _insertAfterFrameId = currentFrame?.id

    if (insertInSectionId) {
      currentSection = sections.find((s) => s.id === insertInSectionId)
    } else {
      currentSection = sections.find((s) => s.id === currentFrame?.section_id)
    }

    const insertInSection = currentSection || sections[0]

    const frameConfig: IFrame['config'] = {
      textColor: '#000',
      allowVoteOnMultipleOptions: false,
    }

    if (contentType === ContentType.RICH_TEXT) {
      frameConfig.allowToCollaborate = true
    }

    const newFrame: IFrame = {
      id: uuidv4(),
      name: `Frame ${(insertInSection?.frames?.length || 0) + 1}`,
      config: frameConfig,
      content: {
        ...(getDefaultContent({
          contentType,
          templateKey,
          // TODO: Fix any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any),
        ...{
          breakoutFrameId: frame.id,
        },
      },
      type: contentType,
      status: FrameStatus.DRAFT,
    }

    let payload = {}
    if (frame?.config?.breakoutType === BREAKOUT_TYPES.ROOMS) {
      if (
        frame?.content?.breakoutRooms?.[addingActivityRoomIndex]?.activityId
      ) {
        deleteFrame(
          getFrameById(
            frame.content?.breakoutRooms?.[addingActivityRoomIndex]
              ?.activityId || ''
          )
        )
      }
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: [
            ...(frame.content?.breakoutRooms?.slice(
              0,
              addingActivityRoomIndex
            ) || []),
            {
              ...frame.content?.breakoutRooms?.[addingActivityRoomIndex],
              ...{
                activityId: newFrame.id,
              },
            },
            ...(frame.content?.breakoutRooms?.slice(
              addingActivityRoomIndex + 1
            ) || []),
          ],
        },
      }
    } else {
      if (frame.content?.groupActivityId) {
        deleteFrame(getFrameById(frame.content?.groupActivityId as string))
      }

      payload = {
        content: {
          ...frame.content,
          groupActivityId: newFrame.id,
        },
      }
    }

    addFrameToSection({
      frame: newFrame,
      section: insertInSection,
      afterFrameId: _insertAfterFrameId!,
    })
    setTimeout(
      () => updateFrame({ framePayload: payload, frameId: frame.id }),
      1000
    )
    setOpenContentTypePicker(false)
  }

  const updateBreakoutRoomName = (name: string, idx: number): void => {
    const payload = {
      content: {
        ...frame.content,
        breakoutRooms: [
          ...(frame.content?.breakoutRooms?.slice(0, idx) || []),
          { ...(frame.content?.breakoutRooms?.[idx] || {}), ...{ name } },
          ...(frame.content?.breakoutRooms?.slice(idx + 1) || []),
        ],
      },
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
  }

  const handleBreakoutActivityFrameDelete = (_frame: IFrame | null) => {
    if (!_frame) return
    let payload = {}
    if (frame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      payload = {
        content: {
          ...frame.content,
          breakoutRooms:
            frame.content?.breakoutRooms?.map((activity, breakoutRoomIndex) =>
              breakoutRoomIndex === deletingActivityFrameIndex
                ? { ...activity, activityId: null }
                : activity
            ) || [],
        },
        config: {
          ...frame.config,
        },
      }
    } else {
      payload = {
        content: {
          ...frame.content,
          groupActivityId: null,
        },
      }
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
    setTimeout(() => deleteFrame(_frame), 1000)
    setDeletingActivityFrameIndex(-1)
  }

  const handleBreakoutRoomDelete = (_frame: IFrame | null) => {
    if (_frame) {
      deleteFrame(_frame)
    }
    let payload = {}
    if (frame.config.breakoutType === BREAKOUT_TYPES.ROOMS) {
      const filteredBreakoutRooms =
        frame.content?.breakoutRooms?.filter(
          (_, breakoutRoomIndex) => breakoutRoomIndex !== deletingRoomIndex
        ) || []
      payload = {
        content: {
          ...frame.content,
          breakoutRooms: filteredBreakoutRooms,
        },
        config: {
          ...frame.config,
          breakoutRoomsCount: filteredBreakoutRooms.length,
        },
      }
    } else {
      payload = {
        content: {
          ...frame.content,
          groupActivityId: null,
        },
      }
    }
    updateFrame({ framePayload: payload, frameId: frame.id })
    setDeletingRoomIndex(-1)
  }

  const addNewRoom = () => {
    if (!currentFrame) return
    const nextRoomCount =
      (currentFrame?.content?.breakoutRooms?.length || 0) + 1
    updateFrame({
      framePayload: {
        config: {
          ...currentFrame?.config,
          breakoutRoomsCount: nextRoomCount,
        },
        content: {
          ...currentFrame?.content,
          breakoutRooms: [
            ...(currentFrame?.content?.breakoutRooms || []),
            {
              name: `Room - ${nextRoomCount}`,
            },
          ],
        },
      },
      frameId: currentFrame.id,
    })
  }

  return (
    <div className="w-full h-full pt-4">
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.ROOMS}>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(262px,_1fr))] gap-3">
          {frame.content?.breakoutRooms?.map((breakout, idx) => (
            <BreakoutRoomActivityCard
              breakout={breakout}
              deleteRoomGroup={(deletingIdx) =>
                setDeletingRoomIndex(deletingIdx)
              }
              hideRoomDelete={(frame.content?.breakoutRooms?.length || 0) <= 2}
              idx={idx}
              editable={editable}
              onAddNewActivity={() => {
                setOpenContentTypePicker(true)
                setAddingActivityRoomIndex(idx)
              }}
              updateBreakoutRoomName={updateBreakoutRoomName}
              deleteActivityFrame={(deletingIdx) =>
                setDeletingActivityFrameIndex(deletingIdx)
              }
            />
          ))}
          <RenderIf
            isTrue={!isMeetingJoined && !preview && eventMode === 'edit'}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className="relative grid place-items-center h-full w-full cursor-pointer border rounded-xl hover:bg-primary group/new-room duration-300 min-h-[200px]"
              onClick={addNewRoom}>
              <HiOutlinePlus
                size={60}
                className="text-primary -mt-5 group-hover/new-room:text-white"
              />
              <p className="text-primary absolute bottom-4 w-full left-0 text-center group-hover/new-room:text-white">
                New Room
              </p>
            </div>
          </RenderIf>
        </div>
      </RenderIf>
      <RenderIf isTrue={frame.config.breakoutType === BREAKOUT_TYPES.GROUPS}>
        <Card
          key="breakout-group-activity"
          shadow="none"
          className="border-2 border-primary-200 p-4 w-full h-full">
          <div className="flex justify-between gap-4">
            <span className="text-md font-semibold">Group Activity</span>
          </div>
          <div className="h-full border border-dotted border-primary-200 p-2 mt-4 flex items-center justify-center rounded-md">
            <RenderIf isTrue={Boolean(frame?.content?.groupActivityId)}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <div
                ref={thumbnailContainerRef}
                className="relative h-full aspect-video"
                onClick={() => {
                  if (!editable) return
                  setCurrentFrame(
                    getFrameById(frame?.content?.groupActivityId || '')
                  )
                }}>
                <BreakoutFrameThumbnailCard
                  frame={getFrameById(frame?.content?.groupActivityId || '')}
                  containerWidth={containerWidth}
                  inViewPort
                />
              </div>
            </RenderIf>
            <RenderIf isTrue={!frame?.content?.groupActivityId && !preview}>
              <div className="flex flex-col gap-4 w-1/2">
                <div className="text-center">
                  You can add existing slide from any section or add new slide
                  which will be added under the Breakout section
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    color="primary"
                    variant="ghost"
                    onClick={() => {
                      setOpenContentTypePicker(true)
                    }}>
                    Add Group Activity
                  </Button>
                </div>
              </div>
            </RenderIf>
          </div>
        </Card>
      </RenderIf>

      <ContentTypePicker
        open={openContentTypePicker}
        onClose={() => setOpenContentTypePicker(false)}
        onChoose={(content, templateType) => {
          handleAddNewFrame(content, templateType)
        }}
        isBreakoutActivity
      />
      <DeleteFrameModal
        isModalOpen={deletingActivityFrameIndex !== -1}
        onClose={() => setDeletingActivityFrameIndex(-1)}
        handleDelete={handleBreakoutActivityFrameDelete}
        frame={getFrameById(
          frame.content?.breakoutRooms?.[deletingActivityFrameIndex]
            ?.activityId as string
        )}
      />
      <DeleteBreakoutRoomModal
        isModalOpen={deletingRoomIndex !== -1}
        onClose={() => setDeletingRoomIndex(-1)}
        handleDelete={handleBreakoutRoomDelete}
        frame={getFrameById(
          frame.content?.breakoutRooms?.[deletingRoomIndex]
            ?.activityId as string
        )}
      />
    </div>
  )
}
