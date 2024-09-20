import { useContext } from 'react'

import { Chip } from '@nextui-org/react'
import uniqBy from 'lodash.uniqby'

import { EditableLabel } from './EditableLabel'
import { RenderIf } from './RenderIf/RenderIf'

import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/types/enums'
import { EventContextType } from '@/types/event-context.type'
import {
  collaborativeTypes,
  goodiesTypes,
  presentationTypes,
} from '@/utils/content.util'
import { getFilteredFramesByStatus } from '@/utils/event.util'

export function SectionOverview() {
  const {
    isOwner,
    sections,
    currentSectionId,
    preview,
    eventMode,
    updateSection,
  } = useContext(EventContext) as EventContextType

  const currentSection = sections.find((s) => s.id === currentSectionId)

  if (!currentSection) return null

  const editable = isOwner && !preview && eventMode === 'edit'

  const currentSectionFrames = getFilteredFramesByStatus({
    frames: currentSection.frames,
    status: editable ? null : FrameStatus.PUBLISHED,
  })

  const getTypesCount = () => {
    let collaborative = 0
    let goodies = 0
    let presentation = 0
    let tags: string[] = []
    currentSectionFrames.forEach((frame) => {
      const isCollaborative = collaborativeTypes.includes(frame.type)
      const isPresentationType = presentationTypes.includes(frame.type)
      const isGoodiesType = goodiesTypes.includes(frame.type)

      if (isCollaborative) collaborative += 1
      if (isPresentationType) presentation += 1
      if (isGoodiesType) goodies += 1
      if (frame.config.tags) {
        tags = [...tags, ...frame.config.tags]
      }
    })

    return {
      tags,
      collaborative,
      goodies,
      presentation,
    }
  }

  const categoriesCount = getTypesCount()

  const distinctTags = uniqBy(categoriesCount.tags, (tag: string) => tag)

  return (
    <div className="w-full h-full">
      <div className="grid w-full h-full bg-white place-items-center bg-opacity-30">
        <div className="grid gap-8 place-items-center">
          <EditableLabel
            showTooltip={false}
            wrapperClass="text-center"
            readOnly={!editable}
            label={currentSection.name}
            className="text-4xl font-semibold tracking-tight cursor-pointer 2xl:text-5xl line-clamp-none"
            onUpdate={(value: string) => {
              updateSection({
                sectionPayload: { name: value },
                sectionId: currentSection.id,
              })
            }}
          />
          <RenderIf isTrue={distinctTags?.length > 0}>
            <div className="flex flex-wrap gap-2 justify-center max-h-[300px] py-2 overflow-y-scroll scrollbar-none">
              {distinctTags.map((tag) => (
                <Chip
                  variant="bordered"
                  size="sm"
                  className="p-3 font-medium bg-transparent rounded-md border-1">
                  {tag}
                </Chip>
              ))}
            </div>
          </RenderIf>
          {/* <div className="flex gap-4 my-4">
            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.collaborative}</p>
              }
              className="pl-2 bg-white border border-green-200 shadow-md">
              Collaborative
            </Chip>

            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.presentation}</p>
              }
              className="pl-2 bg-white border border-blue-200 shadow-md">
              Presentation
            </Chip>

            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.goodies}</p>
              }
              className="pl-2 bg-white border shadow-md border-primary-200">
              Goodies
            </Chip>
          </div> */}
          {/* <RenderIf
            isTrue={section.frames.some((frame) => !!frame.config.colorCode)}>
            <SessionColorTracker
              colorCodes={section.frames.map((frame) => frame.config.colorCode)}
              className="w-[300px] h-6 shadow-xl"
            />
          </RenderIf> */}
        </div>
      </div>
    </div>
  )
}
