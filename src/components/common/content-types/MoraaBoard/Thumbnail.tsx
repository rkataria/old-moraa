import 'tldraw/tldraw.css'
import { useStorage } from '@liveblocks/react/suspense'

import { FrameNoContentPlaceholder } from '../../FrameNoContentPlaceholder'
import { RenderIf } from '../../RenderIf/RenderIf'

import { FrameType } from '@/utils/frame-picker.util'

export function Thumbnail() {
  const thumbnailImageSrc = useStorage((room) => room.thumbnail)

  return (
    <div className="relative w-full h-full p-4">
      <div
        className="absolute left-0 top-0 w-full h-full bg-transparent z-[2]"
        style={{ pointerEvents: 'all' }}
      />

      <RenderIf isTrue={!thumbnailImageSrc}>
        <FrameNoContentPlaceholder frameTyp={FrameType.MORAA_BOARD} />
      </RenderIf>
      <RenderIf isTrue={!!thumbnailImageSrc}>
        <img
          src={thumbnailImageSrc}
          alt="Exported Thumbnail"
          className="aspect-video max-w-[100%] max-h-[100%]"
        />
      </RenderIf>
    </div>
  )
}
