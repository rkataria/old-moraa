/* eslint-disable react-refresh/only-export-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Modal, ModalContent, ModalBody, Button } from '@nextui-org/react'
import {
  IconCards,
  IconAlignCenter,
  IconBrandGoogleDrive,
  IconBrandAdobe,
  IconChartBar,
  IconVideo,
} from '@tabler/icons-react'
import { BsQuestionCircle } from 'react-icons/bs'
import { IoPeopleOutline } from 'react-icons/io5'
import { MdOutlineDraw } from 'react-icons/md'
import { SiMicrosoftpowerpoint, SiMiro } from 'react-icons/si'
import { TbNews } from 'react-icons/tb'

import { ContentTypeCard } from './ContentTypeCard'
import { RenderIf } from './RenderIf/RenderIf'
import { Tooltip } from './ShortuctTooltip'

export interface IContentType {
  name: string
  icon: React.ReactNode
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
    description: 'Create a blank canvas to draw, write',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'blank',
  },
  {
    name: 'Intro',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a intro frame to start your session',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'intro',
  },
  {
    name: 'Quote',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a quote frame to inspire your audience',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'quote',
  },
  {
    name: 'Main Title',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a main title frame to start your session',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'main-title',
  },
  {
    name: 'Article',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a article frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article',
  },
  {
    name: 'Image Left',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a image left frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-left',
  },
  {
    name: 'Image Right',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a image right frame to share your content',
    contentType: ContentType.MORAA_SLIDE,
    templateKey: 'article-image-right',
  },
  {
    name: 'Page',
    icon: <TbNews className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a rich text editor',
    contentType: ContentType.RICH_TEXT,
  },
  // {
  //   name: 'Image',
  //   icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
  //   description: 'Upload and display images on your frames',
  //   contentType: ContentType.IMAGE_VIEWER,
  //   disabled: true, // TODO: Enable this frame when Image Viewer Frame is implemented
  // },
  {
    name: 'Breakout',
    icon: <IoPeopleOutline className="w-full h-full max-w-11 max-h-11" />,
    description: 'Plan breakout rooms and activities',
    contentType: ContentType.BREAKOUT,
  },
  {
    name: 'Video',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed videos from YouTube, Vimeo, or any other video hosting platform',
    contentType: ContentType.VIDEO_EMBED,
    isAvailableForBreakout: true,
  },
  {
    name: 'Poll',
    icon: <IconChartBar className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    contentType: ContentType.POLL,
  },
  {
    name: 'Reflections',
    icon: <IconCards className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    contentType: ContentType.REFLECTION,
    isAvailableForBreakout: true,
  },
  {
    name: 'Moraaboard',
    icon: <MdOutlineDraw className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    contentType: ContentType.MORAA_BOARD,
    isAvailableForBreakout: true,
  },

  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    contentType: ContentType.MIRO_EMBED,
    isAvailableForBreakout: true,
  },
  {
    name: 'Google Slides',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  {
    name: 'Import Powerpoint',
    icon: <SiMicrosoftpowerpoint className="w-full h-full max-w-11 max-h-11" />,
    description: 'Upload and integrate your Powerpoint content as a frame!',
    contentType: ContentType.POWERPOINT,
  },
  {
    name: 'Import PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
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

export function ContentTypePicker({
  open,
  onClose,
  onChoose,
  isBreakoutActivity = false,
}: ChooseContentTypeProps) {
  const collaborativeActivities = [
    getContentType(ContentType.POLL),
    getContentType(ContentType.REFLECTION),
    getContentType(ContentType.MORAA_BOARD),
    getContentType(ContentType.BREAKOUT),
  ]

  const presentationContent = [
    getContentType(ContentType.MORAA_SLIDE, 'blank'),
    getContentType(ContentType.MORAA_SLIDE, 'intro'),
    getContentType(ContentType.MORAA_SLIDE, 'quote'),
    getContentType(ContentType.MORAA_SLIDE, 'main-title'),
    getContentType(ContentType.MORAA_SLIDE, 'article'),
    getContentType(ContentType.MORAA_SLIDE, 'article-image-left'),
    getContentType(ContentType.MORAA_SLIDE, 'article-image-right'),
    getContentType(ContentType.RICH_TEXT),
  ]

  const goodies = [
    getContentType(ContentType.GOOGLE_SLIDES),
    getContentType(ContentType.PDF_VIEWER),
    getContentType(ContentType.MIRO_EMBED),
    getContentType(ContentType.VIDEO_EMBED),
    getContentType(ContentType.POWERPOINT),
  ]

  return (
    <Modal
      size="lg"
      isOpen={open}
      onClose={onClose}
      className="max-h-[96vh] shadow-2xl slide-in"
      classNames={{ wrapper: 'justify-start scrollbar-none duration-300' }}
      scrollBehavior="inside"
      backdrop="transparent">
      <ModalContent>
        {() => (
          <ModalBody className="p-6 scrollbar-none">
            <p className="flex items-center gap-2 text-black/50 text-sm tracking-tight">
              Plan collaborative activities
              <Tooltip content="Generate new ideas or solutions to challenges.">
                <Button
                  isIconOnly
                  variant="light"
                  className="w-auto h-auto min-w-auto">
                  <BsQuestionCircle className="text-black/50" />
                </Button>
              </Tooltip>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {collaborativeActivities.map((activity) => (
                <RenderIf
                  isTrue={Boolean(
                    isBreakoutActivity ? activity?.isAvailableForBreakout : true
                  )}>
                  <ContentTypeCard card={activity} onClick={onChoose} />
                </RenderIf>
              ))}
            </div>
            <RenderIf isTrue={!isBreakoutActivity}>
              <p className="flex items-center gap-2 text-black/50 text-sm tracking-tight mt-4">
                Create presentation content
                <Tooltip content="Creating compelling presentation content that captivates audiences and delivers impactful messages">
                  <Button
                    isIconOnly
                    variant="light"
                    className="w-auto h-auto min-w-auto">
                    <BsQuestionCircle className="text-black/50" />
                  </Button>
                </Tooltip>
              </p>

              <div className="grid grid-cols-2 gap-2">
                {presentationContent.map((activity) => (
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
            </RenderIf>
            <p className="flex items-center gap-2 text-black/50 text-sm tracking-tight mt-4">
              Bring your goodies
              <Tooltip content="Seamless integration of Google Slides, PDFs and other tools to enhance presentation">
                <Button
                  isIconOnly
                  variant="light"
                  className="w-auto h-auto min-w-auto">
                  <BsQuestionCircle className="text-black/50" />
                </Button>
              </Tooltip>
            </p>

            <div className="grid grid-cols-2 gap-2">
              {goodies.map((activity) => (
                <RenderIf
                  isTrue={Boolean(
                    isBreakoutActivity ? activity?.isAvailableForBreakout : true
                  )}>
                  <ContentTypeCard card={activity} onClick={onChoose} />
                </RenderIf>
              ))}
            </div>
          </ModalBody>
        )}
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
