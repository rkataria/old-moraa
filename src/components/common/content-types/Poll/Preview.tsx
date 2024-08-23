import { HorizontalPreview } from './HorizontalPreview'
import { VerticalPreview } from './VerticalPreview'

import { PollFrame, PollOption } from '@/types/frame.type'
import { cn } from '@/utils/utils'

interface PollProps {
  frame: PollFrame
  disableAnimation?: boolean
  renderAsThumbnail?: boolean
}

export function PollPreview({
  frame,
  disableAnimation,
  renderAsThumbnail = false,
}: PollProps) {
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
          className={cn('w-[100%]', {
            'w-full ': renderAsThumbnail,
            'xl:w-[50%]': !renderAsThumbnail,
          })}
          disableAnimation={disableAnimation}
        />
      )}
    </div>
  )
}
