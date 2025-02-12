import { IFrame } from './frame.type'

export type GoogleSlidesFrame = IFrame & {
  content: {
    googleSlideUrl: string
    startPosition?: number
    importAsIndividualFrames?: boolean
  }
}

export type PdfFrame = IFrame & {
  content: {
    pdfPath: string
    defaultPage: number
  }
}

export type MoraaBoardFrame = IFrame & {
  content: {
    document: string
  }
}

export type MoraaSlideFrame = IFrame & {
  content: {
    defaultTemplate: string
    canvas: string
    svg: string
    objects: fabric.Object[]
  }
}

export type EmbedLinkFrame = IFrame & {
  content: {
    url: string
  }
}
