import { IoEyeOff } from 'react-icons/io5'

import { EmptyPlaceholder } from './EmptyPlaceholder'

export function NoFramePreview() {
  return (
    <EmptyPlaceholder
      icon={<IoEyeOff size={96} />}
      title="Oops, preview not available"
      description="Frame preview not available for this frame"
      classNames={{
        icon: 'text-gray-600',
        title: 'text-gray-600',
        description: 'text-gray-400',
      }}
    />
  )
}
