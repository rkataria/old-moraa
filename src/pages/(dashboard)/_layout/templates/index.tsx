import { createFileRoute } from '@tanstack/react-router'
import { GiAirBalloon } from 'react-icons/gi'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/(dashboard)/_layout/templates/')({
  component: () => <TemplatesPage />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

function TemplatesPage() {
  return (
    <EmptyPlaceholder
      title="Community templates coming soon!"
      description="Under development!"
      icon={<GiAirBalloon className=" text-[200px] text-gray-200" />}
    />
  )
}
