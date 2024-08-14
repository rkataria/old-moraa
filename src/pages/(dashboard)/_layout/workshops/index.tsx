import { createFileRoute } from '@tanstack/react-router'
import { GiAirBalloon } from 'react-icons/gi'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

export const Route = createFileRoute('/(dashboard)/_layout/workshops/')({
  component: () => <WorkshopsPage />,
})

function WorkshopsPage() {
  return (
    <EmptyPlaceholder
      title="Workshops coming soon!"
      description="Under development!"
      icon={<GiAirBalloon className=" text-[200px] text-gray-200" />}
    />
  )
}
