import { ReactNode } from 'react'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { LEFT_SIDEBAR_MIN_WIDTH, LEFT_SIDEBAR_WIDTH } from './LeftSidebar'
import { MainContent } from './MainContent'
import { ResizableRightSidebar } from './ResizableRightSidebar'
import { RightSidebar } from './RightSidebar'
import { RenderIf } from '../RenderIf/RenderIf'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function MainContentWithRightSidebar({
  children,
  resizableRightSidebar,
  rightSidebar,
  rightSidebarControls,
  bottomContent,
  noLeftSidebar,
}: {
  children: ReactNode
  resizableRightSidebar: ReactNode
  rightSidebar: ReactNode
  rightSidebarControls: ReactNode
  bottomContent: ReactNode
  noLeftSidebar?: boolean
}) {
  const {
    leftSidebarVisiblity,
    rightSidebarVisiblity,
    resizableRightSidebarVisiblity,
  } = useStudioLayout()
  const containerWidth =
    leftSidebarVisiblity === 'maximized'
      ? `calc(100% - ${LEFT_SIDEBAR_WIDTH}px)`
      : `calc(100% - ${LEFT_SIDEBAR_MIN_WIDTH}px)`

  return (
    <div
      className="flex w-full h-full"
      style={{
        width: noLeftSidebar ? '100%' : containerWidth,
      }}>
      <PanelGroup direction="horizontal" className="pb-2">
        <Panel
          defaultSize={resizableRightSidebarVisiblity ? 60 : 100}
          minSize={resizableRightSidebarVisiblity ? 40 : 100}>
          {/* Main Container */}
          <MainContent hasBottomSection={!!bottomContent}>
            {children}
          </MainContent>
          <RenderIf isTrue={!!bottomContent}>
            <div className="h-[28vh] overflow-y-auto bg-white rounded-md mt-2 p-2">
              {bottomContent}
            </div>
          </RenderIf>
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
