import {
  IconAlignCenter,
  IconBrandAdobe,
  IconCards,
  IconChartBar,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-react'
import { BsQuestion } from 'react-icons/bs'
import { IoPeopleOutline } from 'react-icons/io5'
import { MdOutlineDraw } from 'react-icons/md'
import { SiGoogleslides, SiMicrosoftpowerpoint, SiMiro } from 'react-icons/si'
import { TbNews, TbNotes } from 'react-icons/tb'

export enum FrameCategory {
  PRESENTATION = 'presentation',
  MEDIA = 'media',
  INTERACTION = 'interaction',
  COLLABORATION_TOOL = 'collaboration_tool',
  DOCUMENT = 'document',
}

export type FrameTemplate = {
  key: string
  name: string
  icon?: React.ReactNode
  thumbnail?: string
  description?: string
  isCommingSoon?: boolean
  disabled?: boolean
}

export type FramePickerFrame = {
  name: string
  icon: React.ReactNode
  iconLarge?: React.ReactNode
  iconSmall?: React.ReactNode
  description?: string
  type: FrameType
  disabled?: boolean
  templateKey?: string
  isAvailableForBreakout?: boolean
  category: FrameCategory
  hasTemplates?: boolean
  isCommingSoon?: boolean
  templates?: FrameTemplate[]
}

export enum FrameType {
  MORAA_SLIDE = 'Moraa Slide',
  POLL = 'Poll',
  VIDEO = 'Video',
  GOOGLE_SLIDES = 'Google Slides',
  REFLECTION = 'Reflections',
  PDF_VIEWER = 'PDF',
  VIDEO_EMBED = 'Video Embed',
  MIRO_EMBED = 'Miro Embed',
  IMAGE_VIEWER = 'Image',
  RICH_TEXT = 'Rich Text',
  MORAA_BOARD = 'Moraa Board',
  BREAKOUT = 'Breakout',
  POWERPOINT = 'Powerpoint',
  Q_A = 'Q/A',
  MORAA_PAD = 'Moraapad',
}

const MORAA_SLIDE_TEMPLATES: FrameTemplate[] = [
  {
    key: 'title',
    name: 'Title',
    thumbnail: '/images/frame-templates/moraa-slide/title.png',
  },
  {
    key: 'main-title',
    name: 'Main',
    thumbnail: '/images/frame-templates/moraa-slide/main.png',
  },
  {
    key: 'quote',
    name: 'Quote',
    thumbnail: '/images/frame-templates/moraa-slide/quote.png',
  },
  {
    key: 'article',
    name: 'Article',
    thumbnail: '/images/frame-templates/moraa-slide/article.png',
  },
  {
    key: 'article-image-left',
    name: 'Image Left',
    thumbnail: '/images/frame-templates/moraa-slide/article-image-left.png',
  },
  {
    key: 'article-image-right',
    name: 'Image Right',
    thumbnail: '/images/frame-templates/moraa-slide/article-image-right.png',
  },
]

export const FRAME_PICKER_FRAMES: FramePickerFrame[] = [
  {
    name: 'Moraa Slide',
    icon: <IconAlignCenter className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconAlignCenter size={32} />,
    iconSmall: <IconAlignCenter size={24} />,
    description:
      'Add a standard slide format with customized layouts for engaging visual presentations',
    type: FrameType.MORAA_SLIDE,
    templateKey: 'article',
    category: FrameCategory.PRESENTATION,
    hasTemplates: true,
    templates: MORAA_SLIDE_TEMPLATES,
  },
  {
    name: 'Google Slides',
    icon: <SiGoogleslides className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiGoogleslides size={32} />,
    iconSmall: <SiGoogleslides size={24} />,
    description: 'Empower presentations with seamless Google Slides embed',
    type: FrameType.GOOGLE_SLIDES,
    category: FrameCategory.DOCUMENT,
  },
  {
    name: 'Powerpoint',
    icon: <SiMicrosoftpowerpoint className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMicrosoftpowerpoint size={32} />,
    iconSmall: <SiMicrosoftpowerpoint size={24} />,
    description:
      'Insert PowerPoint slides, keeping your original formatting intact',
    type: FrameType.POWERPOINT,
    category: FrameCategory.DOCUMENT,
  },
  {
    name: 'PDF',
    icon: <IconBrandAdobe className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconBrandAdobe size={32} />,
    iconSmall: <IconBrandAdobe size={24} />,
    description: 'Upload and integrate your PDF content as a multi-page frame!',
    type: FrameType.PDF_VIEWER,
    category: FrameCategory.DOCUMENT,
  },
  {
    name: 'Page',
    icon: <TbNews className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <TbNews size={32} />,
    iconSmall: <TbNews size={24} />,
    description: 'Create a frame using a rich text editor',
    type: FrameType.RICH_TEXT,
    category: FrameCategory.DOCUMENT,
  },
  {
    name: 'Video',
    icon: <IconVideo className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconVideo size={32} />,
    iconSmall: <IconVideo size={24} />,
    description: 'Embed videos from YouTube platform',
    type: FrameType.VIDEO_EMBED,
    category: FrameCategory.MEDIA,
  },
  {
    name: 'Image',
    icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconPhoto size={32} />,
    iconSmall: <IconPhoto size={24} />,
    description: 'Upload and display images on your frames',
    type: FrameType.IMAGE_VIEWER,
    disabled: true, // TODO: Enable this frame when Image Viewer Frame is implemented
    category: FrameCategory.MEDIA,
  },
  {
    name: 'Poll',
    icon: <IconChartBar className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconChartBar size={32} />,
    iconSmall: <IconChartBar size={24} />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    type: FrameType.POLL,
    category: FrameCategory.INTERACTION,
  },
  {
    name: 'Reflections',
    icon: <IconCards className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconCards size={32} />,
    iconSmall: <IconCards size={24} />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    type: FrameType.REFLECTION,
    category: FrameCategory.INTERACTION,
  },
  {
    name: 'Breakout',
    icon: <IoPeopleOutline className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IoPeopleOutline size={32} />,
    iconSmall: <IoPeopleOutline size={24} />,
    description: 'Plan breakout rooms and activities',
    type: FrameType.BREAKOUT,
    category: FrameCategory.COLLABORATION_TOOL,
  },
  {
    name: 'Moraaboard',
    icon: <MdOutlineDraw className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <MdOutlineDraw size={32} />,
    iconSmall: <MdOutlineDraw size={24} />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    type: FrameType.MORAA_BOARD,
    isAvailableForBreakout: true,
    category: FrameCategory.COLLABORATION_TOOL,
  },
  {
    name: 'Q/A',
    icon: <BsQuestion className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <BsQuestion size={32} />,
    iconSmall: <BsQuestion size={24} />,
    description:
      'Create a Q/A to collaborate and brainstorm with your audience',
    type: FrameType.Q_A,
    category: FrameCategory.COLLABORATION_TOOL,
    isCommingSoon: true,
  },
  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMiro size={32} />,
    iconSmall: <SiMiro size={24} />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    type: FrameType.MIRO_EMBED,
    category: FrameCategory.COLLABORATION_TOOL,
    disabled: true,
  },
  {
    name: 'Moraapad',
    icon: <TbNotes className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <TbNotes size={32} />,
    iconSmall: <TbNotes size={24} />,
    description:
      'Create a Moraapad to collaborate and brainstorm with your audience',
    type: FrameType.MORAA_PAD,
    isAvailableForBreakout: true,
    category: FrameCategory.COLLABORATION_TOOL,
    isCommingSoon: false,
  },
]

export const INTERACTIVE_FRAMES = FRAME_PICKER_FRAMES.filter(
  (frame) =>
    [FrameCategory.INTERACTION, FrameCategory.COLLABORATION_TOOL].includes(
      frame.category
    ) && !frame.disabled
)

export const PRESENTATION_FRAMES = FRAME_PICKER_FRAMES.filter(
  (frame) =>
    [
      FrameCategory.PRESENTATION,
      FrameCategory.DOCUMENT,
      FrameCategory.MEDIA,
    ].includes(frame.category) && !frame.disabled
)

export const getFrameType = (frameType: FrameType) =>
  FRAME_PICKER_FRAMES.find((type) => type.type === frameType)
