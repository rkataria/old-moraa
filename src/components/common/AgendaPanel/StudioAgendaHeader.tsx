/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { motion } from 'framer-motion'

import { AddContentButton } from './AddContentButton'

export function StudioAgendaHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
      }}
      layoutId="content-studio-left-sidebar-header">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold">Agenda</span>
          {/* <div className={cn('flex justify-end items-center gap-2')}>
            <AgendaPanelToggle
              collapsed={!contentStudioLeftSidebarVisible}
              onToggle={toggleLeftSidebar}
            />
          </div> */}
        </div>
        <AddContentButton className="flex-auto" />
      </div>
    </motion.div>
  )
}
