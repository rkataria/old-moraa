import { useRef } from 'react'

import { Switch } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { useHotkeys } from 'react-hotkeys-hook'

import { ContentContainer } from '../ContentContainer'
import { FloatingParticipantTiles } from '../FloatingParticipantTiles'
import { MicToggle } from '../MicToggle'
import { VideoToggle } from '../VideoToggle'

import { useAppContext } from '@/hooks/useApp'
import { cn } from '@/utils/utils'

export function ZenModeView() {
  const constraintsRef = useRef<HTMLDivElement>(null)

  const { isZenMode, toggleZenMode } = useAppContext()

  useHotkeys('ctrl+shift+f', () => {
    toggleZenMode()
  })

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
        <div className="w-full h-10 rounded-md text-white flex justify-between items-center p-2 bg-[var(--dyte-participant-tile-bg-color)]">
          <div>
            <Switch
              defaultSelected={isZenMode}
              size="sm"
              onValueChange={toggleZenMode}>
              <span className="text-white">Zen Mode</span>
            </Switch>
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
