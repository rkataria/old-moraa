import { IFrame } from './frame.type'

export type GoogleSlidesType = IFrame & {
  content: {
    googleSlideUrl: string
    startPosition?: number
    importAsIndividualFrames?: boolean
  }
}
