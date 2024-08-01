import { HorizontalPreview } from './HorizontalPreview'
import { VerticalPreview } from './VerticalPreview'

import { PollFrame, PollOption } from '@/types/frame.type'

interface PollProps {
  frame: PollFrame
  disableAnimation?: boolean
}

export function PollPreview({ frame, disableAnimation }: PollProps) {
  const { options } = frame.content

  const polls = options.map((option: PollOption, index) => ({
    ...option,
    percentage: (index + 3) * 10,
    votedUsers: [],
  }))

  const verticalPreview = frame.config.visualization === 'vertical'

  return (
    <div
      className="w-full h-full pt-4"
      style={{
        backgroundColor: frame.config.backgroundColor,
      }}>
      {verticalPreview ? (
        <VerticalPreview
          options={polls}
          disableAnimation={disableAnimation}
          className="h-[70%]"
        />
      ) : (
        <HorizontalPreview
          options={polls}
          className="w-[100%] xl:w-[50%]"
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}
