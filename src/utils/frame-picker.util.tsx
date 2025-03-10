import { IconPhoto } from '@tabler/icons-react'
import { BiSolidBarChartAlt2 } from 'react-icons/bi'
import {
  BsCircleSquare,
  BsFillFileEarmarkRichtextFill,
  BsPlayBtnFill,
  BsPostcardHeart,
  BsQuestion,
} from 'react-icons/bs'
import { FaFilePdf, FaFilePowerpoint } from 'react-icons/fa'
import { HiCloud } from 'react-icons/hi2'
import { LuListTodo } from 'react-icons/lu'
import { PiCodeSimpleBold } from 'react-icons/pi'
import { RiSketching } from 'react-icons/ri'
import { SiGoogleslides, SiMiro, SiSlides } from 'react-icons/si'
import { TbTextWrap } from 'react-icons/tb'

import { MORAA_SLIDE_TEMPLATES } from './moraa-slide-templates'

export enum FrameCategory {
  PRESENTATION = 'presentation',
  MEDIA = 'media',
  INTERACTION = 'interaction',
  COLLABORATION_TOOL = 'collaboration_tool',
  DOCUMENT = 'document',
}

export enum FrameEngagementType {
  CONCEPT = 'concept',
  DISCUSSION = 'discussion',
  BREAK = 'break',
  SPARK = 'spark',
  APPLY = 'apply',
  NONE = 'none',
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
  engagementType?: FrameEngagementType
}

export enum FrameType {
  MORAA_SLIDE = 'Moraa Slide',
  POLL = 'Poll',
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
  MCQ = 'MCQ',
  WORD_CLOUD = 'Word Cloud',
  EMBED_LINK = 'Embed Link',
}

export const FRAME_PICKER_FRAMES: FramePickerFrame[] = [
  {
    name: 'moraaSlide',
    icon: <SiSlides className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiSlides size={32} />,
    iconSmall: <SiSlides size={24} />,
    description:
      'Add a standard slide format with customized layouts for engaging visual presentations',
    type: FrameType.MORAA_SLIDE,
    templateKey: 'article',
    category: FrameCategory.PRESENTATION,
    hasTemplates: true,
    templates: MORAA_SLIDE_TEMPLATES,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'Google Slides',
    icon: <SiGoogleslides className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiGoogleslides size={32} />,
    iconSmall: <SiGoogleslides size={24} />,
    description: 'Empower presentations with seamless Google Slides embed',
    type: FrameType.GOOGLE_SLIDES,
    category: FrameCategory.DOCUMENT,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'Powerpoint',
    icon: <FaFilePowerpoint className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <FaFilePowerpoint size={32} />,
    iconSmall: <FaFilePowerpoint size={24} />,
    description:
      'Insert PowerPoint slides, keeping your original formatting intact',
    type: FrameType.POWERPOINT,
    category: FrameCategory.DOCUMENT,
    disabled: true,
    engagementType: FrameEngagementType.CONCEPT,
  },

  {
    name: 'Page',
    icon: (
      <BsFillFileEarmarkRichtextFill className="w-full h-full max-w-11 max-h-11" />
    ),
    iconLarge: <BsFillFileEarmarkRichtextFill size={32} />,
    iconSmall: <BsFillFileEarmarkRichtextFill size={24} />,
    description: 'Create a frame using a rich text editor',
    type: FrameType.RICH_TEXT,
    category: FrameCategory.DOCUMENT,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'Video',
    icon: <BsPlayBtnFill className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <BsPlayBtnFill size={32} />,
    iconSmall: <BsPlayBtnFill size={24} />,
    description: 'Embed videos from YouTube platform',
    type: FrameType.VIDEO_EMBED,
    category: FrameCategory.MEDIA,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'PDF',
    icon: <FaFilePdf className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <FaFilePdf size={32} />,
    iconSmall: <FaFilePdf size={24} />,
    description: 'Upload and integrate your PDF content as a multi-page frame!',
    type: FrameType.PDF_VIEWER,
    category: FrameCategory.DOCUMENT,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'Image',
    icon: <IconPhoto className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <IconPhoto size={32} />,
    iconSmall: <IconPhoto size={24} />,
    description: 'Upload and display images on your frames',
    type: FrameType.IMAGE_VIEWER,
    category: FrameCategory.MEDIA,
    engagementType: FrameEngagementType.CONCEPT,
  },
  {
    name: 'Poll',
    icon: <BiSolidBarChartAlt2 className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <BiSolidBarChartAlt2 size={32} />,
    iconSmall: <BiSolidBarChartAlt2 size={24} />,
    description:
      'Break ice, gauge opinions visually. Dive into dialogue effortlessly.',
    type: FrameType.POLL,
    category: FrameCategory.INTERACTION,
    engagementType: FrameEngagementType.SPARK,
  },
  {
    name: 'MCQ',
    icon: <LuListTodo className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <LuListTodo size={32} />,
    iconSmall: <LuListTodo size={24} />,
    description:
      'Ask, choose, and learn: Simplify decision-making through interactive MCQs.',
    type: FrameType.MCQ,
    category: FrameCategory.INTERACTION,
    engagementType: FrameEngagementType.SPARK,
  },
  {
    name: 'Reflections',
    icon: <BsPostcardHeart className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <BsPostcardHeart size={32} />,
    iconSmall: <BsPostcardHeart size={24} />,
    description:
      'Ignite insights through thoughtful reflection. Share perspectives, spark growth.',
    type: FrameType.REFLECTION,
    category: FrameCategory.INTERACTION,
    isAvailableForBreakout: true,
    engagementType: FrameEngagementType.DISCUSSION,
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
    disabled: true,
    engagementType: FrameEngagementType.DISCUSSION,
  },
  {
    name: 'Miro',
    icon: <SiMiro className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <SiMiro size={32} />,
    iconSmall: <SiMiro size={24} />,
    description:
      'Embed Miro boards to collaborate and brainstorm with your audience',
    type: FrameType.MIRO_EMBED,
    category: FrameCategory.PRESENTATION,
    disabled: false,
    isAvailableForBreakout: true,
    engagementType: FrameEngagementType.APPLY,
  },
  {
    name: 'Breakout',
    icon: <BsCircleSquare className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <BsCircleSquare size={32} />,
    iconSmall: <BsCircleSquare size={24} />,
    description: 'Plan breakout rooms and activities',
    type: FrameType.BREAKOUT,
    category: FrameCategory.COLLABORATION_TOOL,
    engagementType: FrameEngagementType.APPLY,
  },
  {
    name: 'moraaBoard',
    icon: <RiSketching className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <RiSketching size={32} />,
    iconSmall: <RiSketching size={24} />,
    description:
      'Create a whiteboard to collaborate and brainstorm with your audience',
    type: FrameType.MORAA_BOARD,
    isAvailableForBreakout: true,
    category: FrameCategory.COLLABORATION_TOOL,
    engagementType: FrameEngagementType.APPLY,
  },

  {
    name: 'moraaPad',
    icon: <TbTextWrap className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <TbTextWrap size={32} />,
    iconSmall: <TbTextWrap size={24} />,
    description:
      'Create a Moraapad to collaborate and brainstorm with your audience',
    type: FrameType.MORAA_PAD,
    isAvailableForBreakout: true,
    category: FrameCategory.COLLABORATION_TOOL,
    isCommingSoon: false,
    engagementType: FrameEngagementType.APPLY,
  },
  {
    name: 'Word Cloud',
    icon: <HiCloud className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <HiCloud size={32} />,
    iconSmall: <HiCloud size={24} />,
    description:
      'Collect words in real time and visualize ideas interactively.',
    type: FrameType.WORD_CLOUD,
    category: FrameCategory.INTERACTION,
    engagementType: FrameEngagementType.SPARK,
  },
  {
    name: 'Embed Link',
    icon: <PiCodeSimpleBold className="w-full h-full max-w-11 max-h-11" />,
    iconLarge: <PiCodeSimpleBold size={32} />,
    iconSmall: <PiCodeSimpleBold size={24} />,
    description: 'Easly embed any url for seamless collaboration',
    type: FrameType.EMBED_LINK,
    category: FrameCategory.MEDIA,
    engagementType: FrameEngagementType.CONCEPT,
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

export const isFrameHasVideoAspectRatio = (frameType: FrameType) =>
  [
    FrameType.VIDEO_EMBED,
    FrameType.GOOGLE_SLIDES,
    FrameType.IMAGE_VIEWER,
    FrameType.POWERPOINT,
    FrameType.MORAA_SLIDE,
  ].includes(frameType)
