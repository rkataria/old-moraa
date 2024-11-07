import { type ClassValue, clsx } from 'clsx'
import FontFaceObserver from 'fontfaceobserver'
import toast from 'react-hot-toast'
import { IoIosSquare } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

import { FrameStatus } from '@/types/enums'
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

export const getPublishedFrameCount = (sections: ISection[]) =>
  sections.reduce(
    (acc, section) =>
      acc +
      section.frames.filter((frame) => frame.status === FrameStatus.PUBLISHED)
        .length,
    0
  )

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
    const scrollBottom = childRect.bottom - parentRect.bottom
    if (Math.abs(scrollTop) < Math.abs(scrollBottom)) {
      // we're near the top of the list
      // eslint-disable-next-line no-param-reassign
      parent.scrollTop += scrollTop - topOffset
    } else {
      // we're near the bottom of the list
      // eslint-disable-next-line no-param-reassign
      parent.scrollTop += scrollBottom + bottomOffset
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
    icon: IoIosSquare({ color: '#87E7AB', size: 24 }),
    color: '#87E7AB',
  },
  theory: {
    key: 'theory',
    label: 'Theory',
    icon: IoIosSquare({ color: '#AAC1F4', size: 24 }),
    color: '#AAC1F4',
  },
  discussion: {
    key: 'discussion',
    label: 'Discussion',
    icon: IoIosSquare({ color: '#F28F9A', size: 24 }),
    color: '#F28F9A',
  },
  break: {
    key: 'break',
    label: 'Break',
    icon: IoIosSquare({ color: '#FFD65B', size: 24 }),
    color: '#FFD65B',
  },
  energizer: {
    key: 'energizer',
    label: 'Energizer',
    icon: IoIosSquare({ color: '#C5A3FF', size: 24 }),
    color: '#C5A3FF',
  },
  none: {
    key: 'none',
    label: 'None',
    icon: IoIosSquare({ color: '#C4C4C4', size: 24 }),
    color: '#C4C4C4',
  },
}

export const KeyboardShortcuts = {
  'Studio Mode': {
    newFrame: {
      label: 'Add a new frame',
      key: 'F',
    },
    edit: {
      label: 'Edit/Preview Mode',
      key: 'E',
    },
    notes: {
      label: 'Notes',
      key: 'N',
    },
    share: {
      label: 'Toggle shared status',
      key: 'S',
    },
    overviewTab: {
      label: 'Switch to overview',
      key: '1',
    },
    planTab: {
      label: 'Switch to session planner',
      key: '2',
    },
    contentTab: {
      label: 'Switch to content',
      key: '3',
    },
  },

  'Agenda Panel': {
    grid: {
      label: 'Grid View',
      key: 'G',
    },
    list: {
      label: 'List View',
      key: 'L',
    },
    expandAndCollapse: {
      label: 'Collapse/Expand',
      key: 'alt + [',
      keyWithCode: 'alt+BracketLeft',
    },
  },
  Live: {
    muteUnmute: {
      label: 'Mute / unmute',
      key: 'alt + M',
    },
    startAndStopVideo: {
      label: 'Start / stop video',
      key: 'alt + V',
    },
    raiseAndLowerHand: {
      label: 'Raise/lower hand',
      key: 'alt + H',
    },
    startAndStopPresentation: {
      label: 'Start / stop presentation',
      key: 'S',
    },
    emoji: {
      label: 'Reaction',
      key: 'alt + R',
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
export function truncateHTMLWithTags(htmlString: string, maxLength: number) {
  const div = document.createElement('div')
  div.innerHTML = htmlString

  let truncatedHTML = ''
  let charCount = 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function traverseNodes(node: any) {
    if (charCount >= maxLength) return

    if (node.nodeType === Node.TEXT_NODE) {
      const remainingChars = maxLength - charCount
      truncatedHTML += node.textContent.slice(0, remainingChars)
      charCount += node.textContent.length
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.nodeName.toLowerCase()
      truncatedHTML += `<${tagName}>`

      node.childNodes.forEach(traverseNodes)

      truncatedHTML += `</${tagName}>`
    }
  }

  div.childNodes.forEach(traverseNodes)

  if (charCount > maxLength) {
    truncatedHTML += '...' // Add ellipsis if truncated
  }

  return truncatedHTML
}

export const getGoogleSlidesPresentationId = (url: string) => {
  const regex =
    /^https:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/ // Regular expression to match the presentation ID
  const match = url.match(regex)

  return match ? match[1] : null
}

export const isValidGoogleSlidesUrl = (url: string) => {
  const regex =
    /^https:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/

  return regex.test(url)
}

export const waitForMs = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, ms)
  })
