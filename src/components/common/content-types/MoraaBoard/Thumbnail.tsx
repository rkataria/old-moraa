import 'tldraw/tldraw.css'
import { useStorage } from '@liveblocks/react/suspense'

import { RenderIf } from '../../RenderIf/RenderIf'

import { FRAME_PICKER_FRAMES, FrameType } from '@/utils/frame-picker.util'

export function Thumbnail() {
  const thumbnailImageSrc = useStorage((room) => room.thumbnail)

  return (
    <div className="relative w-full h-full p-4">
      <div
        className="absolute left-0 top-0 w-full h-full bg-transparent z-[2]"
        style={{ pointerEvents: 'all' }}
      />

      <RenderIf isTrue={!thumbnailImageSrc}>
        <div className="scale-[6] h-full flex items-center justify-center text-gray-300">
          {
            FRAME_PICKER_FRAMES.find(
              (frame) => frame.type === FrameType.MORAA_BOARD
            )?.iconLarge
          }
          MoraaBoard
        </div>
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
