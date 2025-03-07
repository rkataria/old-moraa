import { useState } from 'react'

import { BREAKOUT_TYPES, BreakoutTypePicker } from './BreakoutTypePicker'
import { FramePickerCard } from './FramePickerCard'
import { FramePickerTemplateCard } from './FramePickerTemplateCard'
import { FrameTitleDescription } from './FrameTitleDescriptionPreview'
import { NoFramePreview } from './NoFramePreview'
import { RenderIf } from './RenderIf/RenderIf'
import { FrameText } from '../event-content/FrameText'
import { FrameTextBlock } from '../event-content/FrameTextBlock'
import { AssignmentOption } from '../frames/frame-types/Breakout/AssignmentOptionSelector'

import { useStoreDispatch } from '@/hooks/useRedux'
import { setIsPreviewOpenAction } from '@/stores/slices/event/current-event/event.slice'
import { updateFrameThunk } from '@/stores/thunks/frame.thunks'
import { IFrame } from '@/types/frame.type'
import { getDefaultContent, getFrameConfig } from '@/utils/content.util'
import {
  FramePickerFrame,
  FrameType,
  INTERACTIVE_FRAMES,
  PRESENTATION_FRAMES,
} from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export function BlankFrame({
  frame,
  showEmptyPlaceholder = false,
}: {
  frame: IFrame
  showEmptyPlaceholder?: boolean
}) {
  const dispatch = useStoreDispatch()
  const [selectedContentType, setContentType] = useState<FrameType | null>(null)
  const [selectedTemplateKey, setTemplateKey] = useState<string | undefined>(
    undefined
  )

  const [frameSelected, setFrameSelected] = useState<FramePickerFrame | null>(
    null
  )

  const [openBreakoutSelectorModal, setOpenBreakoutSelectorModal] =
    useState<boolean>(false)

  const onChoose = (
    frameType: FrameType,
    templateKey?: string,
    breakoutType?: BREAKOUT_TYPES,
    breakoutRoomsGroupsCount?: number,
    breakoutRoomsGroupsTime?: number,
    assignmentOption?: AssignmentOption
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const previousValues: any = {
      title: frame.content?.title,
      blocks: frame.content?.blocks,
      question: frame?.content?.question || frame.content?.title,
    }
    dispatch(
      updateFrameThunk({
        frameId: frame.id,
        frame: {
          ...frame,
          config: getFrameConfig({
            frameType,
            config: frame.config,
            data: {
              breakoutType,
              breakoutRoomsGroupsCount,
              breakoutRoomsGroupsTime,
              assignmentOption,
            },
          }),
          content: {
            ...getDefaultContent({
              frameType,
              templateKey,
              data: {
                breakoutRoomsCount: breakoutRoomsGroupsCount,
                breakoutType,
              },
            }),
            ...previousValues,
          },
          type: frameType,
        },
      })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleChoose = (frame: FramePickerFrame) => {
    if (frame.type === FrameType.BREAKOUT) {
      setContentType(frame.type)
      setTemplateKey(frame.type)
      setOpenBreakoutSelectorModal(true)

      return
    }
    if (frame.hasTemplates) {
      setFrameSelected(frame)
    } else {
      setFrameSelected(null)
      onChoose(frame.type, frame.templateKey)
    }

    if (showEmptyPlaceholder) {
      dispatch(setIsPreviewOpenAction(false))
    }
  }

  const [editableId, setEditableId] = useState('')

  if (!frame) return null

  const frames = {
    presentation: {
      frames: PRESENTATION_FRAMES,
      title: 'Presentation frames',
      description: 'Use this frame as presentation',
    },
    interactive: {
      frames: INTERACTIVE_FRAMES,
      title: 'Interactive frames',
      description: 'Make this frame interactive',
    },
  }

  const renderFrameTemplates = () => {
    if (!frameSelected) return null

    return (
      <div className="grid grid-cols-5 gap-4 w-full">
        {frameSelected.templates?.map((template) => (
          <FramePickerTemplateCard
            key={template.key}
            frameType={frameSelected.type}
            template={template}
            onClick={(frameType, templateKey) => {
              setFrameSelected(null)
              onChoose(frameType, templateKey)
            }}
          />
        ))}
      </div>
    )
  }

  const renderChooseFrame = () => {
    if (showEmptyPlaceholder) {
      return <NoFramePreview />
    }

    if (frameSelected) {
      return (
        <div className="flex justify-start items-start gap-8 w-[51.25rem]">
          {frameSelected.templates ? renderFrameTemplates() : null}
        </div>
      )
    }

    return (
      <div className="flex justify-start items-start gap-8 w-[51.25rem]">
        {Object.entries(frames).map(([key, value], index) => (
          <div key={key} className="flex-1 flex flex-col gap-8 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-primary">
                {value.title}
              </span>
              <span>{value.description}</span>
            </div>
            <div
              className={cn('grid grid-cols-3 gap-4', {
                'relative after:absolute after:content-[""] after:top-0 after:-right-4 after:w-0.5 after:h-full after:bg-gray-100':
                  index === 0,
              })}>
              {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
              {value.frames.map((frame) => (
                <FramePickerCard
                  key={frame.type}
                  frame={frame}
                  onClick={handleChoose}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderTitleDescription = () => {
    if (!showEmptyPlaceholder) {
      return (
        <>
          <FrameText disableEnter type="title" />
          <FrameTextBlock
            blockType="paragraph"
            editableId={editableId}
            onClick={(blockId: string) => setEditableId(blockId)}
          />
        </>
      )
    }

    return <FrameTitleDescription frame={frame} />
  }

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <div className="h-fit flex flex-col gap-2">
          {renderTitleDescription()}
        </div>
        <RenderIf isTrue={!frame.type}>
          <div className="w-full h-full  backdrop-blur-sm grid place-items-center">
            <div className="flex justify-start items-start gap-8 w-[51.25rem]">
              {renderChooseFrame()}
            </div>
          </div>
        </RenderIf>
      </div>
      <RenderIf isTrue={openBreakoutSelectorModal}>
        <BreakoutTypePicker
          open={openBreakoutSelectorModal}
          onClose={() => setOpenBreakoutSelectorModal(false)}
          onChoose={(
            contentType,
            breakoutRoomsGroupsCount,
            breakoutRoomsGroupsTime,
            assignmentOption
          ) => {
            if (selectedContentType) {
              onChoose(
                selectedContentType,
                selectedTemplateKey,
                contentType,
                breakoutRoomsGroupsCount,
                breakoutRoomsGroupsTime,
                assignmentOption
              )
            }
          }}
        />
      </RenderIf>
    </>
  )
}
