/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
import { ReactNode } from 'react'

import { Draggable } from 'react-beautiful-dnd'

import { FrameItem } from './FrameItem'
import { FramePlaceholder } from '../FramePlaceholder'
import { RenderIf } from '../RenderIf/RenderIf'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { useStudioLayout } from '@/hooks/useStudioLayout'
import { IFrame } from '@/types/frame.type'
import { getBreakoutFrames } from '@/utils/content.util'
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
  const {
    currentFrame,
    insertAfterFrameId,
    currentSectionId,
    saveFrameInLibrary,
  } = useEventContext()
  const isAddFrameLoading = useStoreSelector(
    (state) => state.event.currentEvent.frameState.addFrameThunk.isLoading
  )

  const sidebarExpanded = leftSidebarVisiblity === 'maximized'

  const _insertAfterFrameId = insertAfterFrameId || currentFrame?.id

  if (!showList) return null

  const framesExcludingNestedBreakouts = frames.filter(
    (f) => !f?.content?.breakoutFrameId
  )

  return (
    <div
      className={cn('relative flex flex-col gap-1', {
        'p-2 pl-1': sidebarExpanded,
        'py-1': !sidebarExpanded,
      })}>
      {showList &&
        framesExcludingNestedBreakouts?.map(
          (frame, frameIndex) =>
            frame && (
              <RenderIf
                key={frame.id}
                isTrue={!frame?.content?.breakoutFrameId}>
                <div className="relative flex flex-col group/agenda-frame">
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
                          saveFrameInLibrary={saveFrameInLibrary}
                          actionDisabled={actionDisabled}
                          framePosition={sectionStartingIndex + frameIndex}
                        />
                        <RenderIf
                          isTrue={
                            (currentFrame?.type === FrameType.BREAKOUT &&
                              currentFrame?.id === frame?.id) ||
                            (!!currentFrame &&
                              Boolean(
                                getBreakoutFrames({
                                  frames,
                                  breakoutFrame: frame,
                                })
                                  ?.map((_frame: IFrame) => _frame?.id)
                                  .includes(currentFrame?.id)
                              ))
                          }>
                          <div
                            className={cn('ml-6', {
                              'my-2': getBreakoutFrames({
                                frames,
                                breakoutFrame: frame,
                              })?.length,
                            })}>
                            {getBreakoutFrames({
                              frames,
                              breakoutFrame: frame,
                            })?.map((f: IFrame) => (
                              <div key={f?.id} className="flex w-full">
                                <FrameItem
                                  frame={f}
                                  saveFrameInLibrary={saveFrameInLibrary}
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
