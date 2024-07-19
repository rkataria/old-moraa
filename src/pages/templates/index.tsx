import { createFileRoute } from '@tanstack/react-router'
import { GiAirBalloon } from 'react-icons/gi'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

export function Page() {
  return (
    <EmptyPlaceholder
      label="Community Templates Coming soon!"
      description="Under development!"
      icon={<GiAirBalloon className=" text-[200px] text-gray-200" />}
    />
  )
}

export const Route = createFileRoute('/templates/')({
  component: Page,
})
