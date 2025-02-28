import { cn } from '@heroui/react'
import { ReactNode } from '@tanstack/react-router'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

import { AIChat } from '../common/AIChat'

import { useStoreDispatch, useStoreSelector } from '@/hooks/useRedux'
import { setContentStudioRightResizableSidebarAction } from '@/stores/slices/layout/studio.slice'

export function WithAIChatPanel({ children }: { children: ReactNode }) {
  const dispatch = useStoreDispatch()
  const resizableRightSidebarVisible = useStoreSelector(
    (state) => state.layout.studio.contentStudioRightResizableSidebar
  )

  return (
    <PanelGroup direction="horizontal">
      <Panel
        defaultSize={resizableRightSidebarVisible ? 60 : 100}
        minSize={resizableRightSidebarVisible ? 40 : 100}
        className="!overflow-y-auto">
        {children}
      </Panel>
      {resizableRightSidebarVisible && (
        <PanelResizeHandle className="relative w-2 px-0.5">
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-black/30 cursor-col-resize'
            )}
          />
        </PanelResizeHandle>
      )}
      {resizableRightSidebarVisible && (
        <Panel defaultSize={40} minSize={25} className="border z-10 rounded-lg">
          <AIChat
            onClose={() =>
              dispatch(setContentStudioRightResizableSidebarAction(null))
            }
          />
        </Panel>
      )}
    </PanelGroup>
  )
}
