/* eslint-disable @typescript-eslint/no-explicit-any */
import { FrameContainer } from '@/components/event-content/FrameContainer'

export function ContentStudioFrameContainer() {
  return (
    <div className="w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-thin bg-white">
      <div className="relative w-full pt-[56.25%]">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <FrameContainer />
        </div>
      </div>
    </div>
  )
}
