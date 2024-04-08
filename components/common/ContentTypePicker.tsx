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
  IconPhoto,
} from '@tabler/icons-react'
import { SiMiro } from 'react-icons/si'

import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'

import { cn } from '@/utils/utils'

interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
  disabled?: boolean
}

export enum ContentType {
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
}
export const INTERACTIVE_SLIDE_TYPES = [
  ContentType.POLL,
  ContentType.REFLECTION,
]

export const contentTypes: IContentType[] = [
  {
    name: 'Title & Description',
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
    name: 'Image',
    icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
    description: 'Upload and display images on your slides',
    contentType: ContentType.IMAGE_VIEWER,
    disabled: true, // TODO: Enable this slide when Image Viewer Slide is implemented
  },
  {
    name: 'Google Slides',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  {
    name: 'Google Slides Import',
    icon: <IconBrandGoogleDrive className="w-full h-full max-w-11 max-h-11" />,
    description: 'Empower presentations with seamless Google Slides import',
    contentType: ContentType.GOOGLE_SLIDES_IMPORT,
  },
  {
    name: 'PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
    description: 'Upload and integrate your PDF content as a multi-page slide!',
    contentType: ContentType.PDF_VIEWER,
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
    name: 'Video Embed',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed videos from YouTube, Vimeo, or any other video hosting platform',
    contentType: ContentType.VIDEO_EMBED,
  },
  {
    name: 'Miro Embed',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    contentType: ContentType.MIRO_EMBED,
  },
]

interface ChooseContentTypeProps {
  open: boolean
  onClose: () => void
  onChoose: (contentType: ContentType) => void
}

export function ContentTypePicker({
  open,
  onClose,
  onChoose,
}: ChooseContentTypeProps) {
  return (
    <Modal size="5xl" isOpen={open} onClose={onClose} className="bg-[#18181B]">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl text-white">
                    Gallery of static and interactive content slides{' '}
                  </h3>
                  <p className="text-sm text-gray-200 font-normal">
                    Choose the type of slide you want to add to your event
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="w-full">
                <div className="grid grid-cols-3 justify-start items-center gap-4 scrollbar-none rounded-md">
                  {contentTypes.map((contentType) => (
                    <div
                      key={contentType.contentType}
                      className={cn(
                        'rounded-md  aspect-video cursor-pointer transition-all flex flex-col justify-center items-center gap-2 p-[20px] text-center bg-[#353535] text-white',
                        {
                          'hover:bg-black hover:border-black':
                            !contentType.disabled,
                          'opacity-30 cursor-not-allowed': contentType.disabled,
                        }
                      )}
                      onClick={() => {
                        if (contentType.disabled) return
                        onChoose(contentType.contentType)
                      }}>
                      <div className="w-11 h-11">{contentType.icon}</div>
                      <h3 className="font-semibold text-xl">
                        {contentType.name}
                      </h3>
                      <p className="text-sm text-white">
                        {contentType.description}
                      </p>
                    </div>
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
