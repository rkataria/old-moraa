import { AnimatePresence, motion } from 'framer-motion'

import { AddContentButton } from '../AgendaPanel/AddContentButton'
import { AgendaPanelToggle } from '../AgendaPanel/AgendaPanelToggle'
import { Toolbars } from '../content-types/MoraaSlide/Toolbars'
import { ContentType } from '../ContentTypePicker'

import { useEventContext } from '@/contexts/EventContext'
import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { toggleContentStudioLeftSidebarVisibleAction } from '@/stores/slices/layout/studio.slice'
import { cn } from '@/utils/utils'

export function ContentStudioHeader() {
  return (
    <div className="flex-none flex justify-between items-center p-0 h-12 w-full">
      <LeftSidebar />
      <CenterSidebar />
      <RightSidebar />
    </div>
  )
}

function LeftSidebar() {
  const { contentStudioLeftSidebarVisible } = useStoreSelector(
    (state) => state.layout.studio
  )
  const dispatch = useStoreDispatch()

  const toggleLeftSidebar = () => {
    dispatch(toggleContentStudioLeftSidebarVisibleAction())
  }
  const isVisible = !contentStudioLeftSidebarVisible

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'relative p-2 bg-white rounded-md shadow-2xl flex justify-start items-center gap-0'
          )}>
          <AgendaPanelToggle
            collapsed={!contentStudioLeftSidebarVisible}
            onToggle={toggleLeftSidebar}
          />
          <AddContentButton className="flex-auto pl-2" />
        </motion.div>
      ) : (
        <div />
      )}
    </AnimatePresence>
  )
}

function CenterSidebar() {
  const { currentFrame, isOwner, preview } = useEventContext()

  const editable = isOwner && !preview
  const showToolbars =
    editable && currentFrame?.type === ContentType.MORAA_SLIDE

  return (
    <AnimatePresence>
      {showToolbars ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end items-center gap-2 p-2">
          <Toolbars />
        </motion.div>
      ) : (
        <div />
      )}
    </AnimatePresence>
  )
}

function RightSidebar() {
  return (
    <div className="flex justify-end items-center gap-2 bg-white rounded-md shadow-2xl" />
  )
}
