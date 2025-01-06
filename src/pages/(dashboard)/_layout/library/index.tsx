import { createFileRoute } from '@tanstack/react-router'

import { FrameLibrary } from '@/components/common/FrameLibrary'
import { EventProvider } from '@/contexts/EventContext'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/(dashboard)/_layout/library/')({
  component: () => <Page />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

function Page() {
  return (
    <div>
      <p className="text-2xl font-medium text-black/80">My Library</p>
      <EventProvider eventMode="view">
        <FrameLibrary allowFrameDelete />
      </EventProvider>
    </div>
  )
}
