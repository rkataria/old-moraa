import { useContext } from 'react'

import { Chip } from '@nextui-org/react'

import { EditableLabel } from './EditableLabel'

import { EventContext } from '@/contexts/EventContext'
import { FrameStatus } from '@/services/types/enums'
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

  const filteredSections = sections.filter((s) => s.id === currentSectionId)

  const section = filteredSections[0]

  const editable = isOwner && !preview && eventMode === 'edit'

  const filteredFrames = getFilteredFramesByStatus({
    frames: filteredSections[0].frames,
    status: editable ? null : FrameStatus.PUBLISHED,
  })

  const getTypesCount = () => {
    let collaborative = 0
    let goodies = 0
    let presentation = 0
    filteredFrames.forEach((frame) => {
      const isCollaborative = collaborativeTypes.includes(frame.type)
      const isPresentationType = presentationTypes.includes(frame.type)
      const isGoodiesType = goodiesTypes.includes(frame.type)

      if (isCollaborative) collaborative += 1
      if (isPresentationType) presentation += 1
      if (isGoodiesType) goodies += 1
    })

    return {
      collaborative,
      goodies,
      presentation,
    }
  }

  console.log('filteredFrames', filteredFrames)

  const categoriesCount = getTypesCount()

  return (
    <div
      className="w-full h-full"
      style={{
        background: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
      }}>
      <div className="w-full h-full grid gap-4 place-items-center bg-white bg-opacity-30">
        <div className="grid place-items-center">
          <EditableLabel
            wrapperClass="text-center"
            readOnly={!editable}
            label={section.name}
            className="font-semibold cursor-pointer tracking-tight text-4xl 2xl:text-5xl line-clamp-none"
            onUpdate={(value: string) => {
              updateSection({
                sectionPayload: { name: value },
                sectionId: section.id,
              })
            }}
          />
          <div className="flex gap-4 mt-8">
            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.collaborative}</p>
              }
              className="bg-white shadow-md pl-2 border border-green-200">
              Collaborative
            </Chip>

            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.presentation}</p>
              }
              className="bg-white shadow-md pl-2  border border-blue-200">
              Presentation
            </Chip>
            <Chip
              variant="flat"
              startContent={
                <p className="font-bold">{categoriesCount.goodies}</p>
              }
              className="bg-white shadow-md pl-2  border border-purple-200">
              Goodies
            </Chip>
          </div>
        </div>
      </div>
    </div>
  )
}
