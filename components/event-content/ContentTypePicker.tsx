/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  IconCards,
  IconAlignCenter,
  IconBrandGoogleDrive,
  IconBrandAdobe,
  IconChartBar,
  IconX,
  IconVideo,
} from '@tabler/icons-react'
import clsx from 'clsx'

interface IContentType {
  name: string
  icon: React.ReactNode
  description: string
  contentType: ContentType
}

export enum ContentType {
  COVER = 'Title',
  POLL = 'Poll',
  IMAGE = 'Image',
  VIDEO = 'Video',
  GOOGLE_SLIDES = 'Google Slides',
  REFLECTION = 'Reflections',
  PDF_VIEWER = 'PDF',
  VIDEO_EMBED = 'Video Embed',
}
export const INTERACTIVE_SLIDE_TYPES = [
  ContentType.POLL,
  ContentType.REFLECTION,
]

export const contentTypes: IContentType[] = [
  {
    name: 'Title & Description',
    icon: <IconAlignCenter />,
    description:
      'Simple and effective. Suitable for cover pages and section dividers',
    contentType: ContentType.COVER,
  },
  {
    name: 'Google Slides',
    icon: <IconBrandGoogleDrive />,
    description: 'Empower presentations with seamless Google Slides embed',
    contentType: ContentType.GOOGLE_SLIDES,
  },
  {
    name: 'PDF',
    icon: <IconBrandAdobe />,
    description: 'Upload and integrate your PDF content as a multi-page slide!',
    contentType: ContentType.PDF_VIEWER,
  },
  {
    name: 'Poll',
    icon: <IconChartBar />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    contentType: ContentType.POLL,
  },
  {
    name: 'Reflections',
    icon: <IconCards />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    contentType: ContentType.REFLECTION,
  },
  {
    name: 'Video Embed',
    icon: <IconVideo />,
    description:
      'Embed videos from YouTube, Vimeo, or any other video hosting platform',
    contentType: ContentType.VIDEO_EMBED,
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
    <div
      className={clsx(
        'fixed w-full h-full bg-black/75 left-0 top-0 overflow-hidden z-50',
        {
          'opacity-0 pointer-events-none': !open,
          'opacity-100 pointer-events-auto': open,
        }
      )}>
      <div className="fixed bottom-0 left-0 w-full bg-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              Gallery of static and interactive content slides{' '}
            </h3>
            <p className="text-sm text-gray-500">
              Choose the type of slide you want to add to your event
            </p>
          </div>
          <button aria-label="Close " type="button" onClick={onClose}>
            <IconX />
          </button>
        </div>
        <div className="flex justify-start items-center gap-4 py-4 flex-nowrap overflow-x-auto scrollbar-none rounded-md mt-4">
          {contentTypes.map((contentType, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="h-36 rounded-md flex-none aspect-video cursor-pointer transition-all border-2 flex flex-col justify-center items-center gap-2 p-4 text-center bg-gray-900 text-white hover:bg-black hover:border-black"
              onClick={() => onChoose(contentType.contentType)}>
              <p>{contentType.icon}</p>
              <h3 className="font-bold">{contentType.name}</h3>
              <p className="text-sm text-purple-400">
                {contentType.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
