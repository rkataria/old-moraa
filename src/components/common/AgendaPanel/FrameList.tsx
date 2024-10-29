/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
import { ReactNode } from 'react'

import { Badge } from '@nextui-org/react'
import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'
import { FramePlaceholder } from '../FramePlaceholder'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

type FrameListProps = {
  frames: IFrame[]
  showList: boolean
  droppablePlaceholder: ReactNode
  duplicateFrame: (frame: IFrame) => void
  sectionStartingIndex: number
  actionDisabled: boolean
}

export function FrameList({
  frames,
  showList,
  droppablePlaceholder,
  duplicateFrame,
  sectionStartingIndex,
  actionDisabled,
}: FrameListProps) {
  const { leftSidebarVisiblity } = useStudioLayout()
  const { sections, currentFrame, insertAfterFrameId, currentSectionId } =
    useEventContext()
  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const _insertAfterFrameId = insertAfterFrameId || currentFrame?.id

  if (!showList) return null

  const getBreakoutFrames = (frame: IFrame) => {
    if (frame?.type === FrameType.BREAKOUT) {
      if (frame.content?.breakoutRooms?.length) {
        const breakoutActivityFramesId = frame.content?.breakoutRooms
          .map((activity) => activity.activityId)
          .filter(Boolean)

        const tempFrames = sections.map((sec) => sec.frames).flat(2)

        return breakoutActivityFramesId
          .map((id) => tempFrames.find((tFrame) => tFrame.id === id))
          .filter(Boolean) as IFrame[]
      }
      const tempFrames = sections.map((sec) => sec.frames).flat(2)
      const breakoutFrames = tempFrames.filter(
        (f) => f?.content?.breakoutFrameId === frame?.id
      )

      return breakoutFrames
    }

    return null
  }

  const previousUnrenderedNestedBreakoutsCount = (frameId: string) => {
    const currentFrameIndex = frames.findIndex((f) => f.id === frameId)
    const prevIds = frames.slice(0, currentFrameIndex)

    return prevIds.filter((f) => f?.content?.breakoutFrameId).length
  }

  return (
    <div
      className={cn('relative flex flex-col gap-1', {
        'p-2 pl-6 pr-0': sidebarExpanded,
        'py-1': !sidebarExpanded,
      })}>
      {showList &&
        frames?.map(
          (frame, frameIndex) =>
            frame && (
              <RenderIf
                key={frame.id}
                isTrue={!frame?.content?.breakoutFrameId}>
                <div className="relative flex flex-col  group/agenda-frame">
                  <Draggable
                    isDragDisabled={actionDisabled}
                    key={`frame-draggable-${frame?.id}`}
                    draggableId={`frame-draggable-frameId-${frame?.id}`}
                    index={frameIndex}>
                    {(_provided) => (
                      <div
                        key={frame?.id}
                        ref={_provided.innerRef}
                        {..._provided.draggableProps}
                        {..._provided.dragHandleProps}
                        className="flex w-full flex-col">
                        <FrameItem
                          frame={frame}
                          duplicateFrame={duplicateFrame}
                          actionDisabled={actionDisabled}
                        />
                        <Badge
                          color="default"
                          className="absolute !-left-6 !top-[-1.625rem] hidden scale-[0.8] bg-gray-100 !border-gray-300 !w-fit !right-0 !translate-x-0 !translate-y-0 border text-gray-800  group-hover/agenda-frame:flex"
                          content={
                            sectionStartingIndex +
                            frameIndex -
                            previousUnrenderedNestedBreakoutsCount(frame.id)
                          }>
                          {' '}
                        </Badge>
                        <RenderIf
                          isTrue={
                            (currentFrame?.type === FrameType.BREAKOUT &&
                              currentFrame?.id === frame?.id) ||
                            (!!currentFrame &&
                              Boolean(
                                getBreakoutFrames(frame)
                                  ?.map((_frame) => _frame?.id)
                                  .includes(currentFrame?.id)
                              ))
                          }>
                          <div
                            className={cn('ml-6', {
                              'my-2': getBreakoutFrames(frame)?.length,
                            })}>
                            {getBreakoutFrames(frame)?.map((f) => (
                              <div key={f?.id} className="flex w-full">
                                <FrameItem
                                  frame={f}
                                  duplicateFrame={duplicateFrame}
                                  actionDisabled={actionDisabled}
                                />
                              </div>
                            ))}
                          </div>
                        </RenderIf>
                      </div>
                    )}
                  </Draggable>
                  <RenderIf
                    isTrue={
                      isAddFrameLoading &&
                      (currentFrame?.section_id === frame.section_id ||
                        currentSectionId === frame.section_id) &&
                      ((_insertAfterFrameId &&
                        _insertAfterFrameId === frame?.id) ||
                        (!_insertAfterFrameId &&
                          frameIndex === (frames?.length || 1) - 1))
                    }>
                    <FramePlaceholder />
                  </RenderIf>
                </div>
              </RenderIf>
            )
        )}
      {droppablePlaceholder}
    </div>
  )
}
