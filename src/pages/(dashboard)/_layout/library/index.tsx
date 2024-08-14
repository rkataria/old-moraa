import { createFileRoute } from '@tanstack/react-router'
import { GiAirBalloon } from 'react-icons/gi'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

export const Route = createFileRoute('/(dashboard)/_layout/library/')({
  component: () => <Page />,
})

function Page() {
  return (
    <EmptyPlaceholder
      title="Library coming soon!"
      description="Under development!"
      icon={<GiAirBalloon className=" text-[200px] text-gray-200" />}
    />
  )
}
