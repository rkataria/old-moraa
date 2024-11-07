import { motion } from 'framer-motion'

import { AgendaPanel } from '@/components/common/AgendaPanel'
import { LiveAgendaHeader } from '@/components/common/AgendaPanel/LiveAgendaHeader'
import { useEventContext } from '@/contexts/EventContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function LeftSidebar() {
  const { isOwner } = useEventContext()
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  if (!isOwner) return null

  return (
    <motion.div
      initial={{ marginLeft: -256 }}
      animate={{
        marginLeft: leftSidebarMode === 'maximized' ? 16 : -256,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative w-64 h-full ml-4 rounded-md overflow-hidden bg-white border-1 border-gray-200'
      )}>
      <AgendaPanel header={<LiveAgendaHeader />} />
    </motion.div>
  )
}
