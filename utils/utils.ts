import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileObjectFromBlob = (
  fileName: string,
  blob: Blob,
  fileType: string
) => {
  return new File([blob], fileName, { type: fileType })
}

export const formatSecondsToDuration = (seconds: number) => {
  return [
    formatToPaddedString(seconds / 60 / 60),
    formatToPaddedString((seconds / 60) % 60),
    formatToPaddedString(seconds % 60),
  ].join(":")
}

const formatToPaddedString = (value: number) => {
  return (~~value).toString().padStart(2, "0")
}
