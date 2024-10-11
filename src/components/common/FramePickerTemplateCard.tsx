/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Chip, Tooltip } from '@nextui-org/react'

import { RenderIf } from './RenderIf/RenderIf'

import { FrameTemplate, FrameType } from '@/utils/frame-picker.util'
import { cn } from '@/utils/utils'

// eslint-disable-next-line import/no-cycle

interface FramePickerTemplateCardProps {
  frameType: FrameType
  template: FrameTemplate
  onClick: (frameType: FrameType, templateKey: string) => void
}

export function FramePickerTemplateCard({
  frameType,
  template,
  onClick,
}: FramePickerTemplateCardProps) {
  return (
    <Tooltip
      content={template.name}
      hidden={template.isCommingSoon || !template.name}
      className="max-w-56 w-auto rounded-md bg-black text-white">
      <div
        className={cn(
          'relative bg-cover bg-no-repeat overflow-hidden h-auto aspect-video rounded-md flex justify-center items-center border-2 border-gray-100',
          {
            'cursor-pointer group/content-card hover:border-primary bg-gray-100':
              !template.isCommingSoon,
            'cursor-not-allowed group/content-card-disabled bg-gray-50':
              template.isCommingSoon,
          }
        )}
        style={{
          backgroundImage: `url(${template.thumbnail})`,
        }}
        onClick={() => {
          if (template.isCommingSoon) return

          onClick(frameType, template.key)
        }}>
        <div
          className={cn('flex flex-col gap-2 justify-center items-center', {
            'group-hover/content-card:text-primary': !template.isCommingSoon,
            'text-gray-500': template.isCommingSoon,
          })}>
          {/* {template.iconSmall} */}
          {/* <span className="text-sm font-semibold">{template.name}</span> */}
          <RenderIf isTrue={template.isCommingSoon!}>
            <Chip
              color="default"
              size="sm"
              className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white">
              Coming Soon
            </Chip>
          </RenderIf>
        </div>
      </div>
    </Tooltip>
  )
}
