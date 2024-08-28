import { type ClassValue, clsx } from 'clsx'
import FontFaceObserver from 'fontfaceobserver'
import toast from 'react-hot-toast'
import { IoIosSquare } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

import { ISection } from '@/types/frame.type'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileObjectFromBlob = (
  fileName: string,
  blob: Blob,
  fileType: string
) => new File([blob], fileName, { type: fileType })

export const formatSecondsToDuration = (seconds: number) =>
  [
    formatToPaddedString(seconds / 60 / 60),
    formatToPaddedString((seconds / 60) % 60),
    formatToPaddedString(seconds % 60),
  ].join(':')

const formatToPaddedString = (value: number) =>
  // eslint-disable-next-line no-bitwise
  (~~value).toString().padStart(2, '0')

export const getOjectPublicUrl = (objectPath: string) =>
  `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${objectPath}`

export const getFrameCount = (sections: ISection[]) =>
  sections.reduce((acc, section) => acc + section.frames.length, 0)

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0')

export const actionPreventedOnPreview = () => {
  toast.error('Action prevented in preview mode')
}
export const rgbToHex = (rgb: string) =>
  `#${rgb
    .slice(4, -1)
    .split(',')
    .map((x) => (+x).toString(16).padStart(2, '0'))
    .join('')}`

export const hexToRgb = (hex: string) => {
  const _hex = hex.replace('#', '')

  return `rgb(
    ${parseInt(_hex.substring(0, 2), 16)},
    ${parseInt(_hex.substring(2, 4), 16)},
    ${parseInt(_hex.substring(4, 6), 16)},
  ]`
}

export const isColorDark = (color: string) => {
  if (!color) return true

  let _color = color
  if (color.startsWith('#')) {
    _color = hexToRgb(color)
  }

  const [r, g, b] = _color
    .slice(4, -1)
    .split(',')
    .map((x) => +x)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness < 128
}

export const isColorLight = (color: string) => !isColorDark(color)

export const getAvatarForName = (name: string, avatarUrl?: string) => {
  if (!avatarUrl) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
  }

  return avatarUrl
}

export const getFramesFromSections = (
  sections: ISection[],
  published = false
) =>
  sections.reduce(
    (acc, section) => [
      ...acc,
      ...section.frames.filter((s) =>
        published ? s.status === 'PUBLISHED' : true
      ),
    ],
    [] as ISection['frames']
  )

export function scrollParentToChild({
  parent,
  child,
  topOffset = 0,
  bottomOffset = 0,
}: {
  parent: HTMLElement
  child: HTMLElement
  topOffset?: number
  bottomOffset?: number
}) {
  // Where is the parent on page
  const parentRect = parent.getBoundingClientRect()
  // What can you see?
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  }

  // Where is the child
  const childRect = child.getBoundingClientRect()
  // Is the child viewable?
  const isViewable =
    childRect.top >= parentRect.top &&
    childRect.bottom <= parentRect.top + parentViewableArea.height

  // if you can't see the child try to scroll parent
  if (!isViewable) {
    // Should we scroll using top or bottom? Find the smaller ABS adjustment
    const scrollTop = childRect.top - parentRect.top
    const scrollBot = childRect.bottom - parentRect.bottom
    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      // we're near the top of the list
      // eslint-disable-next-line no-param-reassign
      parent.scrollTop += scrollTop - topOffset
    } else {
      // we're near the bottom of the list
      // eslint-disable-next-line no-param-reassign
      parent.scrollTop += scrollBot + bottomOffset
    }
  }
}

export const areArraysDifferent = <T>(
  array1: Array<T>,
  array2: Array<T>
): boolean => {
  if (array1.length !== array2.length) {
    return true
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return true
    }
  }

  return false
}

export const sortByStatus = (
  a: { status?: string },
  b: { status?: string },
  status: string
) => (b.status === status ? 1 : 0) - (a.status === status ? 1 : 0)

export const FrameColorCodes = {
  exercise: {
    key: 'exercise',
    label: 'Exercise',
    icon: IoIosSquare({ color: '#16a34a', size: 24 }),
    color: '#16a34a',
  },
  theory: {
    key: 'theory',
    label: 'Theory',
    icon: IoIosSquare({ color: '#2563eb', size: 24 }),
    color: '#2563eb',
  },
  discussion: {
    key: 'discussion',
    label: 'Discussion/Debriefing',
    icon: IoIosSquare({ color: '#dc2626', size: 24 }),
    color: '#dc2626',
  },
  break: {
    key: 'break',
    label: 'Break',
    icon: IoIosSquare({ color: '#fde047', size: 24 }),
    color: '#fde047',
  },
  energizer: {
    key: 'energizer',
    label: 'Energizer/IceBreaker',
    icon: IoIosSquare({ color: '#7c3aed', size: 24 }),
    color: '#7c3aed',
  },
  none: {
    key: 'none',
    label: 'None',
    icon: IoIosSquare({ color: '#F3F4F6', size: 24 }),
    color: '#F3F4F6',
  },
}

export const KeyboardShortcuts = {
  Dashboard: {
    createNew: {
      label: 'Create a new event',
      key: 'N',
    },
  },
  'Studio Mode': {
    newSection: {
      label: 'Create a new section at last',
      key: 'alt + N',
    },
    newFrame: {
      label: 'Add a new frame',
      key: 'F',
    },
    edit: {
      label: 'Switch to Edit Mode',
      key: 'E',
    },
    preview: {
      label: 'Switch to Preview Mode',
      key: 'P',
    },
    notes: {
      label: 'Notes',
      key: 'N',
    },
  },

  'Agenda Panel': {
    grid: {
      label: 'Grid View',
      key: 'G',
    },
    list: {
      label: 'Grid View',
      key: 'L',
    },
    expandAndCollapse: {
      label: 'Collapse/Expand',
      key: 'ctrl + [',
    },
  },
  Live: {
    muteUnmute: {
      label: 'Mute / unmute',
      key: 'M',
    },
    startAndStopVideo: {
      label: 'Start / stop video',
      key: 'V',
    },
    raiseAndLowerHand: {
      label: 'Raise/lower hand',
      key: 'H',
    },
    startAndStopPresentation: {
      label: 'Start / stop presentation',
      key: 'S',
    },
    emoji: {
      label: 'Emoji',
      key: 'E',
    },

    startAndStopTimer: {
      label: 'Start / stop timer',
      key: 'T',
    },
    whiteboard: {
      label: 'Start whiteboard',
      key: 'W',
    },
    participants: {
      label: 'Show / hide participants',
      key: 'P',
    },
    chats: {
      label: 'Show / hide Chats',
      key: 'C',
    },
  },
}

export async function loadFont(
  font: string,
  fontWeight = 400,
  fontStyle = 'normal'
) {
  try {
    await new FontFaceObserver(font, {
      weight: fontWeight,
      style: fontStyle,
    }).load()

    return true
  } catch (error) {
    console.error(error, font)

    return false
  }
}
