import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ISection } from '@/types/slide.type'

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

export const getSlideCount = (sections: ISection[]) =>
  sections.reduce((acc, section) => acc + section.slides.length, 0)

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
