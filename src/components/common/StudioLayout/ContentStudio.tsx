import { cn } from '@nextui-org/react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

import { ContentStudioBottomOverlay } from './ContentStudioButtomOverlay'
import { ContentStudioContentContainer } from './ContentStudioContentContainer'
import { ContentStudioLeftSidebar } from './ContentStudioLeftSidebar'
import { ContentStudioRightSidebar } from './ContentStudioRightSidebar'
import { ContentStudioRightSidebarControls } from './ContentStudioRightSidebarControls'

import { AIChatPanel } from '@/components/event-content/AIChatPanel'
import { useStoreSelector } from '@/hooks/useRedux'

const StudioLayoutHeaderHeight = 56

export function ContentStudio() {
  const resizableRightSidebarVisible =
    useStoreSelector(
      (state) => state.layout.studio.contentStudioRightResizableSidebar
    ) !== null

  return (
    <div
      className="w-full p-4 flex justify-start items-start gap-4"
      style={{
        height: `calc(100vh - ${StudioLayoutHeaderHeight}px)`,
      }}>
      <ContentStudioLeftSidebar />
      <div className="flex-auto h-full">
        {/* <ContentStudioHeader /> */}
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={resizableRightSidebarVisible ? 60 : 100}
            minSize={resizableRightSidebarVisible ? 40 : 100}>
            {/* Main Container */}
            <ContentStudioContentContainer />
            <ContentStudioBottomOverlay />
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
            <Panel defaultSize={40} minSize={25} id="meta">
              {/* Right Sidebar */}
              <AIChatPanel />
            </Panel>
          )}
        </PanelGroup>
      </div>
      <ContentStudioRightSidebar />
      <ContentStudioRightSidebarControls />
    </div>
  )
}
