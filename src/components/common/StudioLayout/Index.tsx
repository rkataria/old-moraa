import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { MainContentWithRightSidebar } from './MainContentWithRightSidebar'
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal'

import { StudioLayoutContextProvider } from '@/hooks/useStudioLayout'

type StudioLayoutProps = {
  children: React.ReactNode
  header: React.ReactNode
  leftSidebar: React.ReactNode
  resizableRightSidebar: React.ReactNode
  rightSidebar: React.ReactNode
  rightSidebarControls: React.ReactNode
  bottomContent?: React.ReactNode
}

export function StudioLayout({
  children,
  header,
  leftSidebar,
  resizableRightSidebar,
  rightSidebar,
  rightSidebarControls,
  bottomContent,
}: StudioLayoutProps) {
  return (
    <StudioLayoutContextProvider>
      <div className="flex flex-col justify-start items-start h-screen overflow-hidden">
        <Header>{header}</Header>
        <div className="flex-auto flex justify-start items-start w-full z-0">
          {/* Left Sidebar */}
          {leftSidebar ? <LeftSidebar>{leftSidebar}</LeftSidebar> : null}
          <MainContentWithRightSidebar
            resizableRightSidebar={resizableRightSidebar}
            rightSidebar={rightSidebar}
            bottomContent={bottomContent}
            rightSidebarControls={rightSidebarControls}
            noLeftSidebar={!leftSidebar}>
            {children}
          </MainContentWithRightSidebar>
        </div>
        <KeyboardShortcutsModal />
      </div>
    </StudioLayoutContextProvider>
  )
}
