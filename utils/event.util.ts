import { IFrame } from '@/types/frame.type'

export type FrameStatusType = 'PUBLISHED' | 'DRAFT' | null

export const getFilteredFramesByStatus = ({
  frames,
  status,
}: {
  frames: IFrame[]
  status: FrameStatusType
}) =>
  frames.filter((frame) => {
    if (!status) return true

    return frame.status === status
  })
