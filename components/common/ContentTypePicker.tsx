/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  IconCards,
  IconAlignCenter,
  IconBrandGoogleDrive,
  IconBrandAdobe,
  IconChartBar,
  IconVideo,
  IconLayout,
  IconFileText,
} from '@tabler/icons-react'
import { BsQuestionCircle } from 'react-icons/bs'
import { MdOutlineDraw } from 'react-icons/md'
import { SiMiro } from 'react-icons/si'

import {
  Modal,
  ModalContent,
  ModalBody,
  Tooltip,
  Button,
} from '@nextui-org/react'

import { ContentTypeCard } from './ContentTypeCard'

import { getContentType } from '@/utils/content.util'
import { cn } from '@/utils/utils'

export interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
  disabled?: boolean
  templateType?: CANVAS_TEMPLATE_TYPES
}

export enum ContentType {
  CANVAS = 'Canvas',
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
}
export const INTERACTIVE_FRAME_TYPES = [
  ContentType.POLL,
  ContentType.REFLECTION,
]

export enum CANVAS_TEMPLATE_TYPES {
  BLANK = 'Blank',
  TEMPLATE_ONE = 'Template One',
  TEMPLATE_TWO = 'Template Two',
  TEMPLATE_THREE = 'Template Three',
}

export const contentTypes: IContentType[] = [
  {
    name: 'Blank',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a blank canvas to draw, write',
    contentType: ContentType.CANVAS,
    templateType: CANVAS_TEMPLATE_TYPES.BLANK,
  },
  {
    name: 'Title Description',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a frame with title and description',
    contentType: ContentType.CANVAS,
    templateType: CANVAS_TEMPLATE_TYPES.TEMPLATE_ONE,
  },
  {
    name: 'Title Image',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a frame with title and image',
    contentType: ContentType.CANVAS,
    templateType: CANVAS_TEMPLATE_TYPES.TEMPLATE_TWO,
  },
  {
    name: 'Title',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Simple and effective. Suitable for cover pages and section dividers',
    contentType: ContentType.COVER,
  },
  {
    name: 'Text & Image',
    icon: <IconLayout className="w-full h-full max-w-11 max-h-11" />,
    description: 'Combine text and image to create a visually appealing frame',
    contentType: ContentType.TEXT_IMAGE,
  },
  {
    name: 'Page',
    icon: <IconFileText className="w-full h-full max-w-11 max-h-11" />,
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
    name: 'Video',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed videos from YouTube, Vimeo, or any other video hosting platform',
    contentType: ContentType.VIDEO_EMBED,
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
  },
  {
    name: 'Moraaboard',
    icon: <MdOutlineDraw className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    contentType: ContentType.MORAA_BOARD,
  },

  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    contentType: ContentType.MIRO_EMBED,
  },
  {
    name: 'Google Slides',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  // {
  //   name: 'Import Google Slides',
  //   icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
  //   description: 'Empower presentations with seamless Google Slides import',
  //   contentType: ContentType.GOOGLE_SLIDES_IMPORT,
  // },
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
  onChoose: (
    contentType: ContentType,
    templateType: CANVAS_TEMPLATE_TYPES | undefined
  ) => void
}

export function ContentTypePicker({
  open,
  onClose,
  onChoose,
}: ChooseContentTypeProps) {
  const collaborativeActivities = [
    getContentType(ContentType.POLL),
    getContentType(ContentType.REFLECTION),
    getContentType(ContentType.MORAA_BOARD),
  ]

  const presentationContent = [
    getContentType(ContentType.CANVAS, CANVAS_TEMPLATE_TYPES.BLANK),
    getContentType(ContentType.CANVAS, CANVAS_TEMPLATE_TYPES.TEMPLATE_ONE),
    getContentType(ContentType.CANVAS, CANVAS_TEMPLATE_TYPES.TEMPLATE_TWO),
    getContentType(ContentType.COVER),
    getContentType(ContentType.TEXT_IMAGE),
    getContentType(ContentType.RICH_TEXT),
  ]

  const goodies = [
    getContentType(ContentType.GOOGLE_SLIDES),
    getContentType(ContentType.PDF_VIEWER),
    getContentType(ContentType.MIRO_EMBED),
    getContentType(ContentType.VIDEO_EMBED),
  ]

  return (
    <Modal
      size="lg"
      isOpen={open}
      onClose={onClose}
      className={cn('max-h-[96vh] shadow-2xl slide-in')}
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
                <ContentTypeCard card={activity} onClick={onChoose} />
              ))}
            </div>

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
                <ContentTypeCard card={activity} onClick={onChoose} />
              ))}
            </div>

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
                <ContentTypeCard card={activity} onClick={onChoose} />
              ))}
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
