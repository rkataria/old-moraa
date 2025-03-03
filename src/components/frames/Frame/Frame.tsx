import React from 'react'

// eslint-disable-next-line import/no-cycle
import { LiveFrame } from './LiveFrame'
import { PreviewFrame } from './PreviewFrame'
import { StudioFrame } from './StudioFrame'
import { ThumbnailFrame } from './ThumbnailFrame'

import { useEventContext } from '@/contexts/EventContext'
import { RoomProvider } from '@/contexts/RoomProvider'
import { IFrame } from '@/types/frame.type'
import { FrameType } from '@/utils/frame-picker.util'

type FrameProps = {
  frame: IFrame
  isThumbnail?: boolean
}

export function Frame({ frame, isThumbnail }: FrameProps) {
  const { preview, eventMode } = useEventContext()

  if (!frame) return <div>Frame not found</div>

  const Wrapper =
    frame.type === FrameType.MORAA_BOARD ? RoomProvider : React.Fragment

  const wrapperProps: { frameId: string } =
    frame.type === FrameType.MORAA_BOARD
      ? { frameId: frame.id }
      : (null as never)

  if (isThumbnail) {
    return (
      <Wrapper {...(wrapperProps || {})}>
        <ThumbnailFrame frame={frame} />
      </Wrapper>
    )
  }

  if (eventMode === 'edit' && !preview) {
    return (
      <Wrapper {...(wrapperProps || {})}>
        <StudioFrame frame={frame} />
      </Wrapper>
    )
  }

  if (eventMode === 'present') {
    return (
      <Wrapper {...(wrapperProps || {})}>
        <LiveFrame frame={frame} />
      </Wrapper>
    )
  }

  return (
    <Wrapper {...(wrapperProps || {})}>
      <PreviewFrame frame={frame} />
    </Wrapper>
  )
}
