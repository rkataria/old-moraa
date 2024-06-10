import { ReactNode } from 'react'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { MainContent } from './MainContent'
import { RightSidebar } from './RightSidebar'

import { useStudioLayout } from '@/hooks/useStudioLayout'
import { cn } from '@/utils/utils'

export function MainContentWithRightSidebar({
  children,
  rightSidebar,
}: {
  children: ReactNode
  rightSidebar: ReactNode
}) {
  const { rightSidebarVisiblity } = useStudioLayout()

  return (
    <PanelGroup direction="horizontal">
      <Panel
        defaultSize={rightSidebarVisiblity ? 60 : 100}
        minSize={rightSidebarVisiblity ? 40 : 100}>
        {/* Main Container */}
        <MainContent>{children}</MainContent>
      </Panel>
      {rightSidebarVisiblity && (
        <PanelResizeHandle className="relative w-2">
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-full h-16 rounded-full bg-gray-300 cursor-col-resize'
            )}
          />
        </PanelResizeHandle>
      )}
      {rightSidebarVisiblity && (
        <Panel defaultSize={40} minSize={25}>
          {/* Right Sidebar */}
          <RightSidebar>{rightSidebar}</RightSidebar>
        </Panel>
      )}
    </PanelGroup>
  )
}
