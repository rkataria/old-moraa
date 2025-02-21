/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Tabs,
  Tab,
} from '@nextui-org/react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { IoArrowBack } from 'react-icons/io5'

// eslint-disable-next-line import/no-cycle
import { FramePickerCard } from './FramePickerCard'
import { FramePickerTemplateCard } from './FramePickerTemplateCard'
// eslint-disable-next-line import/no-cycle
import { BreakoutFrameLibrary } from './Library/BreakoutFrameLibrary'
// eslint-disable-next-line import/no-cycle
import { FrameLibrary } from './Library/FrameLibrary'

import { useEventContext } from '@/contexts/EventContext'
import { LibraryService } from '@/services/library.service'
import { IFrame } from '@/types/frame.type'
import {
  FRAME_PICKER_FRAMES,
  FramePickerFrame,
  FrameType,
  INTERACTIVE_FRAMES,
  PRESENTATION_FRAMES,
} from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

export const INTERACTIVE_FRAME_TYPES = [FrameType.POLL, FrameType.REFLECTION]

type FramePickerProps = {
  open: boolean
  onClose: () => void
  onChoose: (contentType: FrameType, templateKey?: string) => void
  isBreakoutActivity?: boolean
  breakoutFrameId?: string
  onBreakoutFrameImport?: (frame: IFrame) => void
}

const frames = {
  presentation: {
    frames: PRESENTATION_FRAMES,
    title: 'Presentation frames',
    description: 'Add presentation frame to your presentation',
  },
  interactive: {
    frames: INTERACTIVE_FRAMES,
    title: 'Interactive frames',
    description: 'Add interactive frame to your presentation',
  },
}

const breakoutFrames = FRAME_PICKER_FRAMES.filter(
  (frame) => frame.isAvailableForBreakout && !frame.disabled
)

export function FramePicker({
  open,
  onClose,
  onChoose,
  isBreakoutActivity = false,
  breakoutFrameId,
  onBreakoutFrameImport,
}: FramePickerProps) {
  const {
    meeting,
    currentSectionId,
    sections,
    setOpenContentTypePicker,
    insertAfterFrameId,
  } = useEventContext()
  const [frameSelected, setFrameSelected] = useState<FramePickerFrame | null>(
    null
  )
  const importFrameMutation = useMutation({
    mutationFn: (
      data: Parameters<typeof LibraryService.importFrameFromLibrary>[0]
    ) => LibraryService.importFrameFromLibrary(data),
  })

  const handleChoose = (frame: FramePickerFrame) => {
    if (frame.hasTemplates) {
      setFrameSelected(frame)
    } else {
      setFrameSelected(null)
      onChoose(frame.type, frame.templateKey)
    }
  }

  const onFrameImport = async (frame: IFrame) => {
    const loadingToast = toast.loading('Importing the frame...')
    await importFrameMutation.mutate(
      {
        frameId: frame.id,
        meetingId: meeting!.id,
        sectionId: currentSectionId || sections[sections.length - 1]?.id,
        insertAfterFrameId: insertAfterFrameId as string,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast)
          toast.success('Frame imported')
          setOpenContentTypePicker(false)
        },
      }
    )
  }

  const onBreakoutActivityFrameImport = async (frame: IFrame) => {
    const loadingToast = toast.loading('Importing the frame...')
    await importFrameMutation.mutate(
      {
        frameId: frame.id,
        meetingId: meeting!.id,
        sectionId: currentSectionId || sections[sections.length - 1]?.id,
        insertAfterFrameId: breakoutFrameId as string,
        breakoutFrameId,
      },
      {
        onSuccess(data) {
          toast.dismiss(loadingToast)
          toast.success('Frame imported')
          onBreakoutFrameImport?.(data.frame)
        },
      }
    )
  }

  const onBreakoutExistingActivityImport = async (frame: IFrame) => {
    onBreakoutFrameImport?.(frame)
  }

  const renderHeaderContents = () => {
    if (isBreakoutActivity) {
      return (
        <div className="flex flex-col gap-2">
          <span>Choose a frame for your breakout activity</span>
          <span className="text-sm font-normal text-gray-200">
            Choose a frame for your breakout activity. You can choose from a
            variety of frames to customize your breakout activity. You can
            choose from a variety of frames to customize your breakout activity.
          </span>
        </div>
      )
    }

    if (frameSelected) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-start items-center gap-2">
            <IoArrowBack
              size={18}
              className="cursor-pointer"
              onClick={() => setFrameSelected(null)}
            />
            <span>Choose a template</span>
          </div>
          <span className="text-sm font-normal text-gray-200">
            {`Choose from ${frameSelected.name} templates`}
          </span>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        <span>Choose a frame</span>
        <span className="text-sm font-normal text-gray-200">
          {`Select the type of frame you'd like to use for your presentation
          content. Choose from various frame formats to customize your slides,
          media, and interactive elements`}
        </span>
      </div>
    )
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

  const renderContents = () => {
    if (isBreakoutActivity) {
      return (
        <div>
          <Tabs>
            <Tab title="Create Frame">
              <div className="z-0 flex justify-start items-start gap-8 h-full">
                <div className={cn('grid grid-cols-6 gap-4 w-full')}>
                  {breakoutFrames.map((frame) => (
                    <FramePickerCard
                      key={frame.type}
                      frame={frame}
                      onClick={handleChoose}
                    />
                  ))}
                </div>
              </div>
            </Tab>
            <Tab title="Import From Library">
              <FrameLibrary
                onFrameClick={
                  importFrameMutation.isPending
                    ? () => null
                    : onBreakoutActivityFrameImport
                }
                frameTypes={breakoutFrames.map((f) => f.type)}
              />
            </Tab>
            <Tab title="Existing Frames">
              <BreakoutFrameLibrary
                meetingId={meeting!.id}
                onFrameClick={
                  importFrameMutation.isPending
                    ? () => null
                    : onBreakoutExistingActivityImport
                }
              />
            </Tab>
          </Tabs>
        </div>
      )
    }

    if (frameSelected) {
      return (
        <div className="p-4 z-0 flex justify-start items-start gap-4">
          {frameSelected.templates ? renderFrameTemplates() : null}
        </div>
      )
    }

    return (
      <div>
        <Tabs>
          <Tab title="Create Frame">
            <div className="p-4 z-0 flex justify-start items-start gap-8 h-full">
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
          </Tab>
          <Tab title="Import From Library">
            <FrameLibrary
              onFrameClick={
                importFrameMutation.isPending ? () => null : onFrameImport
              }
            />
          </Tab>
        </Tabs>
      </div>
    )
  }

  return (
    <Modal
      size="4xl"
      placement="top"
      isOpen={open}
      onClose={() => {
        setFrameSelected(null)
        onClose()
      }}
      classNames={{
        closeButton: 'text-white bg-black/10 hover:bg-black/20 top-5 right-5',
      }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white h-[9.125rem] p-6">
              {renderHeaderContents()}
            </ModalHeader>
            <ModalBody className="my-4">{renderContents()}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
