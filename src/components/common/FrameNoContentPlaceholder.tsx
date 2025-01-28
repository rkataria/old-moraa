import { FRAME_PICKER_FRAMES, FrameType } from '@/utils/frame-picker.util'

export function FrameNoContentPlaceholder({
  frameTyp,
}: {
  frameTyp: FrameType
}) {
  const frame = FRAME_PICKER_FRAMES.find((f) => f.type === frameTyp)

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="scale-[6] h-full flex items-center justify-center gap-1 text-gray-300">
        {frame?.iconSmall}
        {frame?.name}
      </div>
    </div>
  )
}
