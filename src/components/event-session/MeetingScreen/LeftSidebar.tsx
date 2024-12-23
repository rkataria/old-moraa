import { useEffect } from 'react'

import { motion } from 'framer-motion'

import { AgendaPanel } from '@/components/common/AgendaPanel'
import { LiveAgendaHeader } from '@/components/common/AgendaPanel/LiveAgendaHeader'
import { useEventContext } from '@/contexts/EventContext'
import { useAppContext } from '@/hooks/useApp'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import {
  maximizeLeftSidebarAction,
  minimizeLeftSidebarAction,
} from '@/stores/slices/layout/live.slice'
import { cn } from '@/utils/utils'

export function LeftSidebar() {
  const { isZenMode } = useAppContext()
  const { isOwner } = useEventContext()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)
  const dispatch = useStoreDispatch()

  useEffect(() => {
    if (isZenMode) {
      dispatch(minimizeLeftSidebarAction())
    } else {
      dispatch(maximizeLeftSidebarAction())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isZenMode])

  if (!isOwner) return null

  return (
    <motion.div
      initial={{ marginLeft: -224 }}
      animate={{
        marginLeft: leftSidebarMode === 'maximized' ? 16 : -224,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative w-56 h-full ml-4 rounded-md overflow-hidden bg-white border-1 border-gray-200'
      )}>
      <AgendaPanel header={<LiveAgendaHeader />} />
    </motion.div>
  )
}
