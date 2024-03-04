import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
