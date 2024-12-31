import { v4 as uuidv4 } from 'uuid'

import { FrameType } from './frame-picker.util'

import { BREAKOUT_TYPES } from '@/components/common/BreakoutTypePicker'
import { FrameStatus } from '@/types/enums'
import { IFrame } from '@/types/frame.type'

export const headerBlock = {
  id: uuidv4(),
  type: 'header',
  data: {
    html: '',
  },
}
export const paragraphBlock = {
  id: uuidv4(),
  type: 'paragraph',
  data: {
    html: '',
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultContent = ({
  frameType,
  data,
  templateKey,
}: {
  frameType: FrameType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  templateKey?: string
}) => {
  switch (frameType) {
    case FrameType.MORAA_SLIDE:
      return {
        defaultTemplate: templateKey,
        canvas: null,
      }
    case FrameType.RICH_TEXT:
      return {
        blocks: [
          {
            id: uuidv4(),
            type: 'richtext',
            data: {},
          },
          headerBlock,
          paragraphBlock,
        ],
      }

    case FrameType.VIDEO:
      return {
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.VIDEO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.POLL:
      return {
        question: '',
        options: [
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
        ],
        blocks: [paragraphBlock],
      }

    case FrameType.MCQ:
      return {
        question: '',
        options: [
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
          {
            name: '',
            color: '#E7E0FF',
            id: uuidv4(),
          },
        ],
        blocks: [paragraphBlock],
      }

    case FrameType.REFLECTION:
      return {
        blocks: [paragraphBlock],
      }

    case FrameType.GOOGLE_SLIDES:
      return {
        googleSlideUrl: '',
        startPosition: 1,
      }

    case FrameType.PDF_VIEWER:
      return {
        googleSlideUrl: '', // FIXME: This should be pdfURL
        startPosition: 1,
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MIRO_EMBED:
      return {
        blocks: [headerBlock, paragraphBlock],
      }

    case FrameType.MORAA_BOARD:
      return {
        blocks: [headerBlock, paragraphBlock],
      }
    case FrameType.BREAKOUT:
      return {
        blocks: [headerBlock, paragraphBlock],
        title: data?.title,
        description: data?.description,
        breakoutRooms:
          data?.breakoutType === BREAKOUT_TYPES.GROUPS
            ? undefined
            : new Array(data?.breakoutRoomsCount)
                .fill('')
                .map((_, idx) => ({ name: `Room - ${idx + 1}`, id: uuidv4() })),
      }

    default:
      return {}
  }
}

export const isFrameInteractive = (frame: IFrame) =>
  [
    FrameType.POLL,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.PDF_VIEWER,
    FrameType.MORAA_BOARD,
  ].includes(frame.type)

export const isFrameThumbnailAvailable = (frameType: FrameType) =>
  [
    FrameType.IMAGE_VIEWER,
    FrameType.PDF_VIEWER,
    FrameType.POLL,
    FrameType.REFLECTION,
    FrameType.VIDEO_EMBED,
    FrameType.MIRO_EMBED,
    FrameType.RICH_TEXT,
  ].includes(frameType)

export const collaborativeTypes = [
  FrameType.POLL,
  FrameType.REFLECTION,
  FrameType.MORAA_BOARD,
  FrameType.BREAKOUT,
]
export const presentationTypes = [FrameType.MORAA_SLIDE, FrameType.RICH_TEXT]
export const goodiesTypes = [
  FrameType.GOOGLE_SLIDES,
  FrameType.PDF_VIEWER,
  FrameType.MIRO_EMBED,
  FrameType.VIDEO_EMBED,
]

export const getContentStudioRightSidebarControlKeys = (
  frame: IFrame,
  preview: boolean
) => {
  if (preview) {
    return ['frame-notes']
  }

  if ([FrameType.MORAA_SLIDE].includes(frame.type as FrameType)) {
    return ['frame-appearance', 'frame-notes', 'frame-status']
  }

  if (
    [
      FrameType.BREAKOUT,
      FrameType.POLL,
      FrameType.REFLECTION,
      FrameType.MORAA_BOARD,
      FrameType.PDF_VIEWER,
      FrameType.MCQ,
      FrameType.MIRO_EMBED,
      FrameType.VIDEO_EMBED,
    ].includes(frame.type as FrameType)
  ) {
    return ['frame-settings', 'frame-notes', 'frame-status']
  }

  return ['frame-notes', 'frame-status']
}

export const getBreakoutFrames = ({
  frames,
  breakoutFrame,
}: {
  frames: IFrame[]
  breakoutFrame?: IFrame
}) => {
  if (breakoutFrame?.type === FrameType.BREAKOUT) {
    if (breakoutFrame.content?.breakoutRooms?.length) {
      const breakoutActivityFramesId = breakoutFrame.content?.breakoutRooms
        .map((activity) => activity.activityId)
        .filter(Boolean)

      return breakoutActivityFramesId
        .map((id) => frames.find((tFrame) => tFrame.id === id))
        .filter(Boolean) as IFrame[]
    }
    const breakoutFrames = frames.filter(
      (f) => f?.content?.breakoutFrameId === breakoutFrame?.id
    )

    return breakoutFrames
  }

  return null
}

export const getBlankFrame = (name: string) => ({
  id: uuidv4(),
  name,
  config: {
    time: 1,
  },
  status: FrameStatus.DRAFT,
})
