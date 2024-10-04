/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react'
import {
  IconCards,
  IconAlignCenter,
  IconBrandAdobe,
  IconChartBar,
  IconVideo,
  IconPhoto,
} from '@tabler/icons-react'
import { BsQuestionCircle } from 'react-icons/bs'
import { IoPeopleOutline } from 'react-icons/io5'
import { MdOutlineDraw } from 'react-icons/md'
import { SiGoogleslides, SiMicrosoftpowerpoint, SiMiro } from 'react-icons/si'
import { TbNews } from 'react-icons/tb'

import { RenderIf } from './RenderIf/RenderIf'
import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

import { useFlags } from '@/flags/client'
import { cn } from '@/utils/utils'

export enum ContentCategory {
  PRESENTATION = 'presentation',
  MEDIA = 'media',
  INTERACTION = 'interaction',
  COLLABORATION_TOOL = 'collaboration_tool',
  DOCUMENT = 'document',
}

export interface ContentTypePickerFrame {
  name: string
  icon: React.ReactNode
  iconLarge?: React.ReactNode
  iconSmall?: React.ReactNode
  description: string
  contentType: ContentType
  disabled?: boolean
  templateKey?: string
  isAvailableForBreakout?: boolean
  category: ContentCategory
}

export enum ContentType {
  MORAA_SLIDE = 'Moraa Slide',
  COVER = 'Title',
  POLL = 'Poll',
  VIDEO = 'Video',
  GOOGLE_SLIDES = 'Google Slides',
  GOOGLE_SLIDES_IMPORT = 'Google Slides Import',
  REFLECTION = 'Reflections',
  PDF_VIEWER = 'PDF',
  VIDEO_EMBED = 'Video Embed',
  MIRO_EMBED = 'Miro Embed',
  IMAGE_VIEWER = 'Image',
  TEXT_IMAGE = 'Text & Image',
  RICH_TEXT = 'Rich Text',
  MORAA_BOARD = 'Moraa Board',
  BREAKOUT = 'Breakout',
  POWERPOINT = 'Powerpoint',
}

export const INTERACTIVE_FRAME_TYPES = [
  ContentType.POLL,
  ContentType.REFLECTION,
]

export const frames: ContentTypePickerFrame[] = [
  {
    name: 'Article',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={32} />,
    iconSmall: <IconAlignCenter size={18} />,
    description: 'Create a article frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article',
    category: ContentCategory.PRESENTATION,
  },
  {
    name: 'Image Left',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={32} />,
    iconSmall: <IconAlignCenter size={18} />,
    description: 'Create a image left frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-left',
    category: ContentCategory.PRESENTATION,
  },
  {
    name: 'Image Right',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={32} />,
    iconSmall: <IconAlignCenter size={18} />,
    description: 'Create a image right frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-right',
    category: ContentCategory.PRESENTATION,
  },
  {
    name: 'Page',
    icon: <TbNews className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <TbNews size={32} />,
    iconSmall: <TbNews size={18} />,
    description: 'Create a rich text editor',
    contentType: ContentType.RICH_TEXT,
    isAvailableForBreakout: true,
    category: ContentCategory.DOCUMENT,
  },
  {
    name: 'Image',
    icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconPhoto size={32} />,
    iconSmall: <IconPhoto size={18} />,
    description: 'Upload and display images on your frames',
    contentType: ContentType.IMAGE_VIEWER,
    disabled: true, // TODO: Enable this frame when Image Viewer Frame is implemented
    category: ContentCategory.MEDIA,
  },
  {
    name: 'Breakout',
    icon: <IoPeopleOutline className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IoPeopleOutline size={32} />,
    iconSmall: <IoPeopleOutline size={18} />,
    description: 'Plan breakout rooms and activities',
    contentType: ContentType.BREAKOUT,
    category: ContentCategory.COLLABORATION_TOOL,
  },
  {
    name: 'Video',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconVideo size={32} />,
    iconSmall: <IconVideo size={18} />,
    description: 'Embed videos from YouTube platform',
    contentType: ContentType.VIDEO_EMBED,
    isAvailableForBreakout: true,
    category: ContentCategory.MEDIA,
  },
  {
    name: 'Poll',
    icon: <IconChartBar className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconChartBar size={32} />,
    iconSmall: <IconChartBar size={18} />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    contentType: ContentType.POLL,
    category: ContentCategory.INTERACTION,
  },
  {
    name: 'Reflections',
    icon: <IconCards className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconCards size={32} />,
    iconSmall: <IconCards size={18} />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    contentType: ContentType.REFLECTION,
    isAvailableForBreakout: true,
    category: ContentCategory.INTERACTION,
  },
  {
    name: 'Moraaboard',
    icon: <MdOutlineDraw className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <MdOutlineDraw size={32} />,
    iconSmall: <MdOutlineDraw size={18} />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    contentType: ContentType.MORAA_BOARD,
    isAvailableForBreakout: true,
    category: ContentCategory.COLLABORATION_TOOL,
  },

  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMiro size={32} />,
    iconSmall: <SiMiro size={18} />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    contentType: ContentType.MIRO_EMBED,
    isAvailableForBreakout: true,
    category: ContentCategory.COLLABORATION_TOOL,
  },
  {
    name: 'Google Slides',
    icon: <SiGoogleslides className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiGoogleslides size={32} />,
    iconSmall: <SiGoogleslides size={18} />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
    category: ContentCategory.DOCUMENT,
  },
  {
    name: 'Import Powerpoint',
    icon: <SiMicrosoftpowerpoint className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMicrosoftpowerpoint size={32} />,
    iconSmall: <SiMicrosoftpowerpoint size={18} />,
    description: 'Upload and integrate your Powerpoint content as a frame!',
    contentType: ContentType.POWERPOINT,
    category: ContentCategory.DOCUMENT,
  },
  {
    name: 'Import PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconBrandAdobe size={32} />,
    iconSmall: <IconBrandAdobe size={18} />,
    description: 'Upload and integrate your PDF content as a multi-page frame!',
    contentType: ContentType.PDF_VIEWER,
    category: ContentCategory.DOCUMENT,
  },
]

interface ChooseContentTypeProps {
  open: boolean
  onClose: () => void
  onChoose: (contentType: ContentType, templateKey?: string) => void
  isBreakoutActivity?: boolean
}

export function ContentTypePicker({
  open,
  onClose,
  onChoose,
  isBreakoutActivity = false,
}: ChooseContentTypeProps) {
  const { flags } = useFlags()

  const frameCategories = {
    [ContentCategory.PRESENTATION]: {
      label: 'Presentation',
      helpText: 'Create presentation content',
    },
    [ContentCategory.DOCUMENT]: {
      label: 'Document',
      helpText: 'Upload and integrate your PDF content as a multi-page frame!',
    },
    [ContentCategory.MEDIA]: {
      label: 'Media',
      helpText: 'Upload and display images on your frames',
    },
    [ContentCategory.COLLABORATION_TOOL]: {
      label: 'Collaboration Tool',
      helpText:
        'Embed Miro boards to collaborate and brainstorm with your audience',
    },
    [ContentCategory.INTERACTION]: {
      label: 'Interaction',
      helpText:
        'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    },
  }

  const framesWithCategory = Object.entries(frameCategories).map(
    ([category, { label, helpText }]) => ({
      category,
      label,
      helpText,
      frames: frames.filter((frame) => frame.category === category),
    })
  )

  // Feature flags
  if (flags?.enable_ppt_import) {
    frames.filter((frame) => frame.contentType !== ContentType.POWERPOINT)
  }

  // Remove disabled frames
  framesWithCategory.forEach((category) => {
    category.frames = category.frames.filter((frame) => !frame.disabled)
  })

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      className="max-h-[96vh] max-w-5xl shadow-2xl slide-up m-auto"
      classNames={{
        wrapper: 'justify-center scrollbar-none duration-300 bg-black/20',
      }}
      scrollBehavior="inside"
      backdrop="transparent">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Pick Frame</ModalHeader>
        <ModalBody
          id="content-picker-container"
          className="p-4 pt-0 scrollbar-none relative">
          <div className="z-0 flex flex-col gap-4">
            {framesWithCategory.map(
              ({ category, label, helpText, frames: _frames }) => (
                <div
                  className={cn('p-4 rounded-md flex flex-col gap-4')}
                  id={category}>
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-primary">{label}</p>
                    <Tooltip size="sm" content={helpText}>
                      <div>
                        <BsQuestionCircle className="text-black/50" />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {_frames.map((frame) => (
                      <RenderIf
                        isTrue={Boolean(
                          isBreakoutActivity
                            ? frame?.isAvailableForBreakout
                            : true
                        )}>
                        <Tooltip content={frame.description}>
                          <Button
                            variant="ghost"
                            startContent={frame.iconSmall}
                            onClick={() =>
                              onChoose(frame.contentType, frame.templateKey)
                            }>
                            {frame.name}
                          </Button>
                        </Tooltip>
                        {/* <ContentTypeCard card={frame} onClick={onChoose} /> */}
                      </RenderIf>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const getContentType = (
  frameType: ContentType,
  templateKey?: string
) => {
  if (templateKey) {
    return frames.find(
      (type) =>
        type.contentType === frameType && type.templateKey === templateKey
    )
  }

  return frames.find((type) => type.contentType === frameType)
}
