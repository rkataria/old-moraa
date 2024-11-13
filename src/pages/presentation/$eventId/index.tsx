import { createFileRoute } from '@tanstack/react-router'

import { PresentationEmbed } from '@/components/common/PresentationEmbed/PresentationEmbed'
import { EventProvider } from '@/contexts/EventContext'
import { beforeLoad } from '@/utils/before-load'

export const Route = createFileRoute('/presentation/$eventId/')({
  component: EmbedPage,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeLoad,
})

function EmbedPage() {
  return (
    <EventProvider eventMode="present">
      <PresentationEmbed />
    </EventProvider>
  )
}
