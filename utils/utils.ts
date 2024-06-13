import { type ClassValue, clsx } from 'clsx'
import toast from 'react-hot-toast'
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
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${objectPath}`

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
