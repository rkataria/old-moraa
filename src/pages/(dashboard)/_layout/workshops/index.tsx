import { createFileRoute } from '@tanstack/react-router'
import { GiAirBalloon } from 'react-icons/gi'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/(dashboard)/_layout/workshops/')({
  component: () => <WorkshopsPage />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
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
