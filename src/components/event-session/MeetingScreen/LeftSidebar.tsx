import { motion } from 'framer-motion'

import { AgendaPanel } from '@/components/common/AgendaPanel'
import { LiveAgendaHeader } from '@/components/common/AgendaPanel/LiveAgendaHeader'
import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function LeftSidebar() {
  const { leftSidebarMode } = useStoreSelector((state) => state.layout.live)

  return (
    <motion.div
      initial={{ marginLeft: -256 }}
      animate={{
        marginLeft: leftSidebarMode === 'maximized' ? 8 : -256,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative w-64 h-full bg-white ml-2 rounded-md overflow-hidden'
      )}>
      <AgendaPanel
        header={<LiveAgendaHeader />}
        collapsed={leftSidebarMode === 'collapsed'}
      />
    </motion.div>
  )
}
