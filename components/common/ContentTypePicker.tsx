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
import { MdOutlineDraw } from 'react-icons/md'
import { SiMiro } from 'react-icons/si'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
} from '@nextui-org/react'

interface IContentType {
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
export const INTERACTIVE_SLIDE_TYPES = [
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
    description: 'Create a slide with title and description',
    contentType: ContentType.CANVAS,
    templateType: CANVAS_TEMPLATE_TYPES.TEMPLATE_ONE,
  },
  {
    name: 'Title Image',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    description: 'Create a slide with title and image',
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
    description: 'Combine text and image to create a visually appealing slide',
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
  //   description: 'Upload and display images on your slides',
  //   contentType: ContentType.IMAGE_VIEWER,
  //   disabled: true, // TODO: Enable this slide when Image Viewer Slide is implemented
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
    name: 'Embed Google Slides',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  {
    name: 'Import Google Slides',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides import',
    contentType: ContentType.GOOGLE_SLIDES_IMPORT,
  },
  {
    name: 'Import PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
    description: 'Upload and integrate your PDF content as a multi-page slide!',
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
  return (
    <Modal size="4xl" isOpen={open} onClose={onClose} className="bg-[#E9D8FD]">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl text-black">
                    Gallery of static and interactive content slides
                  </h3>
                  <p className="text-sm text-black-200 font-normal ">
                    Choose the type of slide you want to add to your event
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-6">
              {/* New section for Cards */}
              <div className="w-full mt-2">
                <div className="grid grid-cols-3 gap-4">
                  {contentTypes.map((contentType) => (
                    <Card
                      shadow="sm"
                      key={contentType.contentType}
                      isPressable
                      onPress={() => {
                        if (!contentType.disabled) {
                          onChoose(
                            contentType.contentType,
                            contentType.templateType
                          )
                        }
                      }}
                      className="hover:bg-gray-300 flex-col items-start">
                      <CardBody className="p-2.5 flex flex-col items-start w-full">
                        <div className="bg-gray-200 p-1 rounded-md w-max">
                          <div className="flex items-center justify-center w-full h-full">
                            <div className="w-8 h-8">{contentType.icon}</div>
                          </div>
                        </div>

                        <h3 className="mt-2 font-semibold text-sm w-full text-left">
                          {contentType.name}
                        </h3>

                        <p className="text-sm mt-1 w-full text-left">
                          {contentType.description}
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
