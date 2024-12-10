import { Editor } from './Editor'

import { IFrame } from '@/types/frame.type'

type ThumbnailProps = {
  frame: IFrame
}

export function Thumbnail({ frame }: ThumbnailProps) {
  return (
    <div className="relative w-full h-full p-4">
      <div
        className="absolute left-0 top-0 w-full h-full bg-transparent z-[2]"
        style={{ pointerEvents: 'all' }}
      />
      <Editor frame={frame} asThumbnail />
    </div>
  )
}
