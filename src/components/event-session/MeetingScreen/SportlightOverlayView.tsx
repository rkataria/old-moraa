import { useRef } from 'react'

import { motion } from 'framer-motion'

import { ContentTilesLayoutDropdown } from './ContentTilesLayoutDropdown'
import { ContentContainer } from '../ContentContainer'
import { FloatingParticipantTiles } from '../FloatingParticipantTiles'
import { MicToggle } from '../MicToggle'
import { VideoToggle } from '../VideoToggle'

import { cn } from '@/utils/utils'

export function SportlightOverlayView() {
  const constraintsRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={constraintsRef}
      className={cn(
        'relative flex-1 w-full h-full rounded-md overflow-hidden overflow-y-auto scrollbar-none',
        'drag-area'
      )}>
      <ContentContainer />
      <motion.div
        whileDrag={{ opacity: 0.8 }}
        className="w-72 absolute top-4 right-4 z-10 flex flex-col gap-2 p-2"
        drag
        dragConstraints={constraintsRef}>
        <FloatingParticipantTiles />
        <div className="w-full rounded-md text-white flex justify-between items-center p-2 bg-[var(--dyte-participant-tile-bg-color)]">
          <div>
            <ContentTilesLayoutDropdown />
          </div>
          <div>
            <MicToggle />
            <VideoToggle />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
