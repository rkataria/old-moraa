/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import { motion } from 'framer-motion'
import { Fragment } from 'react/jsx-runtime'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { ParticipantsGrid } from './ParticipantsGrid'

import { useParticipantsGrid } from '@/hooks/useParticipantsGrid'
import { cn } from '@/utils/utils'

export function MeetingParticipants() {
  const { panelConfig } = useParticipantsGrid()

  return (
    <motion.div layout className="w-full h-full">
      <PanelGroup
        key={panelConfig.panels.length}
        direction={panelConfig.direction as any}>
        {panelConfig.panels.map((panel, index) => (
          <Fragment key={index}>
            <Panel
              minSize={panel.minSize}
              defaultSize={panel.defaultSize}
              maxSize={panel.maxSize}>
              <ParticipantsGrid participants={panel.participants} />
            </Panel>
            <PanelResizeHandle
              className={cn({
                'opacity-50 bg-gray-800 w-2 h-12 rounded-full relative z-10 top-1/2 -translate-y-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500':
                  panelConfig.direction === 'horizontal',
                'opacity-50 bg-gray-800 h-2 w-12 rounded-full relative z-10 left-1/2 top-0 -translate-x-1/2 cursor-col-resize group-hover:opacity-100 transition-opacity duration-500':
                  panelConfig.direction === 'vertical',
              })}
              hidden={index === panelConfig.panels.length - 1}
            />
          </Fragment>
        ))}
      </PanelGroup>
    </motion.div>
  )
}
