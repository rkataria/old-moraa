import { Suspense } from 'react'

import { StudioAgendaHeader } from './StudioAgendaHeader'
import { ContentLoading } from '../ContentLoading'

import { AgendaPanel } from '@/components/common/AgendaPanel'

export function StudioAgendaPanel() {
  return (
    <Suspense fallback={<ContentLoading />}>
      <AgendaPanel header={<StudioAgendaHeader />} />
    </Suspense>
  )
}
