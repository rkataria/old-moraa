import { ReactNode } from 'react'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { MainContent } from './MainContent'
import { ResizableRightSidebar } from './ResizableRightSidebar'
import { RightSidebar } from './RightSidebar'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function MainContentWithRightSidebar({
  children,
  resizableRightSidebar,
  rightSidebar,
  rightSidebarControls,
}: {
  children: ReactNode
  resizableRightSidebar: ReactNode
  rightSidebar: ReactNode
  rightSidebarControls: ReactNode
}) {
  const { rightSidebarVisiblity, resizableRightSidebarVisiblity } =
    useStudioLayout()

  return (
    <div className="flex w-full h-full">
      <PanelGroup direction="horizontal" className="pb-2">
        <Panel
          defaultSize={resizableRightSidebarVisiblity ? 60 : 100}
          minSize={resizableRightSidebarVisiblity ? 40 : 100}>
          {/* Main Container */}
          <MainContent>{children}</MainContent>
        </Panel>
        {resizableRightSidebarVisiblity && (
          <PanelResizeHandle className="relative w-2 px-0.5">
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-black/30 cursor-col-resize'
              )}
            />
          </PanelResizeHandle>
        )}
        {resizableRightSidebarVisiblity && (
          <Panel defaultSize={40} minSize={25}>
            {/* Right Sidebar */}
            <ResizableRightSidebar>
              {resizableRightSidebar}
            </ResizableRightSidebar>
          </Panel>
        )}
      </PanelGroup>
      {/* Right Sidebar */}
      {rightSidebarVisiblity && <RightSidebar>{rightSidebar}</RightSidebar>}
      {rightSidebarControls}
    </div>
  )
}
