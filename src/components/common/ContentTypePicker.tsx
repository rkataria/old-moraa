/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react'

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

import { ContentTypeCard } from './ContentTypeCard'
import { RenderIf } from './RenderIf/RenderIf'
import { Tooltip } from './ShortuctTooltip'
import { Button } from '../ui/Button'

import { useFlags } from '@/flags/client'
import { cn, scrollParentToChild } from '@/utils/utils'

export interface IContentType {
  name: string
  icon: React.ReactNode
  iconLarge?: React.ReactNode
  description: string
  contentType: ContentType
  disabled?: boolean
  templateKey?: string
  isAvailableForBreakout?: boolean
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

export const contentTypes: IContentType[] = [
  {
    name: 'Blank',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a blank canvas to draw, write',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'blank',
  },
  {
    name: 'Intro',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a intro frame to start your session',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'intro',
  },
  {
    name: 'Quote',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a quote frame to inspire your audience',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'quote',
  },
  {
    name: 'Main Title',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a main title frame to start your session',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'main-title',
  },
  {
    name: 'Article',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a article frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article',
  },
  {
    name: 'Image Left',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a image left frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-left',
  },
  {
    name: 'Image Right',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={48} />,
    description: 'Create a image right frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-right',
  },
  {
    name: 'Page',
    icon: <TbNews className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <TbNews size={48} />,
    description: 'Create a rich text editor',
    contentType: ContentType.RICH_TEXT,
    isAvailableForBreakout: true,
  },
  {
    name: 'Image',
    icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconPhoto size={48} />,
    description: 'Upload and display images on your frames',
    contentType: ContentType.IMAGE_VIEWER,
    disabled: true, // TODO: Enable this frame when Image Viewer Frame is implemented
  },
  {
    name: 'Breakout',
    icon: <IoPeopleOutline className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IoPeopleOutline size={48} />,
    description: 'Plan breakout rooms and activities',
    contentType: ContentType.BREAKOUT,
  },
  {
    name: 'Video',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconVideo size={48} />,
    description:
      'Embed videos from YouTube, Vimeo, or any other video hosting platform',
    contentType: ContentType.VIDEO_EMBED,
    isAvailableForBreakout: true,
  },
  {
    name: 'Poll',
    icon: <IconChartBar className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconChartBar size={48} />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    contentType: ContentType.POLL,
  },
  {
    name: 'Reflections',
    icon: <IconCards className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconCards size={48} />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    contentType: ContentType.REFLECTION,
    isAvailableForBreakout: true,
  },
  {
    name: 'Moraaboard',
    icon: <MdOutlineDraw className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <MdOutlineDraw size={48} />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    contentType: ContentType.MORAA_BOARD,
    isAvailableForBreakout: true,
  },

  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMiro size={48} />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    contentType: ContentType.MIRO_EMBED,
    isAvailableForBreakout: true,
  },
  {
    name: 'Google Slides',
    icon: <SiGoogleslides className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiGoogleslides size={48} />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  {
    name: 'Import Powerpoint',
    icon: <SiMicrosoftpowerpoint className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMicrosoftpowerpoint size={48} />,
    description: 'Upload and integrate your Powerpoint content as a frame!',
    contentType: ContentType.POWERPOINT,
  },
  {
    name: 'Import PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconBrandAdobe size={48} />,
    description: 'Upload and integrate your PDF content as a multi-page frame!',
    contentType: ContentType.PDF_VIEWER,
  },
]

interface ChooseContentTypeProps {
  open: boolean
  onClose: () => void
  onChoose: (contentType: ContentType, templateKey?: string) => void
  isBreakoutActivity?: boolean
}

enum CONTENT_CATEGORY {
  PRESENTATION = 'presentation',
  GOODIES = 'goodies',
  COLLABORATIVE = 'collaborative',
}

export function ContentTypePicker({
  open,
  onClose,
  onChoose,
  isBreakoutActivity = false,
}: ChooseContentTypeProps) {
  const { flags } = useFlags()
  const [activeTab, setActiveTab] = useState<CONTENT_CATEGORY>(
    CONTENT_CATEGORY.COLLABORATIVE
  )

  const collaborativeActivities = [
    getContentType(ContentType.POLL),
    getContentType(ContentType.REFLECTION),
    getContentType(ContentType.MORAA_BOARD),
    getContentType(ContentType.BREAKOUT),
  ]

  const presentationContent = [
    getContentType(ContentType.MORAA_SLIDE, 'main-title'),
    getContentType(ContentType.MORAA_SLIDE, 'article-image-left'),
    getContentType(ContentType.MORAA_SLIDE, 'article-image-right'),
    getContentType(ContentType.RICH_TEXT),
  ]

  const goodies = [
    getContentType(ContentType.GOOGLE_SLIDES),
    getContentType(ContentType.PDF_VIEWER),
    getContentType(ContentType.MIRO_EMBED),
    getContentType(ContentType.VIDEO_EMBED),
  ]

  // Feature flags
  if (flags?.enable_ppt_import) {
    goodies.push(getContentType(ContentType.POWERPOINT))
  }

  useEffect(() => {
    const content = document.getElementById(activeTab)
    const container = document.getElementById('content-picker-container')

    if (content && container) {
      scrollParentToChild({
        parent: container,
        child: content,
        topOffset: 100,
        bottomOffset: 100,
      })
    }
  }, [activeTab])

  const framesWithCategory = {
    [CONTENT_CATEGORY.COLLABORATIVE]: {
      label: 'Plan collaborative activities',
      helpText: 'Generate new ideas or solutions to challenges.',
      frames: collaborativeActivities,
    },
    [CONTENT_CATEGORY.PRESENTATION]: {
      label: 'Create presentation content',
      helpText: 'Create presentation content',
      frames: presentationContent,
    },
    [CONTENT_CATEGORY.GOODIES]: {
      label: 'Bring your goodies',
      helpText: 'Bring your goodies',
      frames: goodies,
    },
  }

  return (
    <Modal
      size="5xl"
      isOpen={open}
      onClose={onClose}
      className="max-h-[96vh] shadow-2xl slide-up m-auto"
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
          <div className="flex justify-start items-center gap-2 sticky top-0 z-[1] bg-white py-4">
            <Button
              color={
                activeTab === CONTENT_CATEGORY.COLLABORATIVE
                  ? 'primary'
                  : 'default'
              }
              onClick={() => setActiveTab(CONTENT_CATEGORY.COLLABORATIVE)}>
              Collaborative
            </Button>
            <Button
              color={
                activeTab === CONTENT_CATEGORY.PRESENTATION
                  ? 'primary'
                  : 'default'
              }
              onClick={() => setActiveTab(CONTENT_CATEGORY.PRESENTATION)}>
              Presentation
            </Button>
            <Button
              color={
                activeTab === CONTENT_CATEGORY.GOODIES ? 'primary' : 'default'
              }
              onClick={() => setActiveTab(CONTENT_CATEGORY.GOODIES)}>
              Goodies
            </Button>
          </div>
          <div className="z-0 flex flex-col gap-4">
            {Object.entries(framesWithCategory).map(
              ([category, { label, helpText, frames }]) => (
                <div
                  className={cn('p-4 rounded-md flex flex-col gap-4')}
                  id={category}>
                  <div className="flex justify-start items-center gap-2">
                    <p className="text-primary">{label}</p>
                    <Tooltip content={helpText}>
                      <Button size="sm" isIconOnly>
                        <BsQuestionCircle className="text-black/50" />
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {frames.map((activity) => (
                      <RenderIf
                        isTrue={Boolean(
                          isBreakoutActivity
                            ? activity?.isAvailableForBreakout
                            : true
                        )}>
                        <ContentTypeCard card={activity} onClick={onChoose} />
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
    return contentTypes.find(
      (type) =>
        type.contentType === frameType && type.templateKey === templateKey
    )
  }

  return contentTypes.find((type) => type.contentType === frameType)
}
