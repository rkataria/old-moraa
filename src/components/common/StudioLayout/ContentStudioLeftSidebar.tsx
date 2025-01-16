import { motion } from 'framer-motion'

import { StudioAgendaPanel } from '../AgendaPanel/StudioAgendaPanel'

import { useStoreSelector } from '@/hooks/useRedux'
import { cn } from '@/utils/utils'

export function ContentStudioLeftSidebar() {
  const { contentStudioLeftSidebarVisible } = useStoreSelector(
    (state) => state.layout.studio
  )

  return (
    <motion.div
      initial={{ marginLeft: -224 }}
      animate={{
        marginLeft: contentStudioLeftSidebarVisible ? 0 : -240,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'relative flex-none w-56 h-full rounded-md overflow-hidden bg-white border-1 border-gray-200'
      )}>
      <div className={cn('flex-none w-56 h-full rounded-lg z-[2]')}>
        <StudioAgendaPanel />
      </div>
    </motion.div>
  )
}
