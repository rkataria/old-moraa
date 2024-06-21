import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { MainContentWithRightSidebar } from './MainContentWithRightSidebar'

import { StudioLayoutContextProvider } from '@/hooks/useStudioLayout'

type StudioLayoutProps = {
  children: React.ReactNode
  header: React.ReactNode
  leftSidebar: React.ReactNode
  resizableRightSidebar: React.ReactNode
  rightSidebar: React.ReactNode
  rightSidebarControls: React.ReactNode
}

export function StudioLayout({
  children,
  header,
  leftSidebar,
  resizableRightSidebar,
  rightSidebar,
  rightSidebarControls,
}: StudioLayoutProps) {
  return (
    <StudioLayoutContextProvider>
      <div className="flex flex-col justify-start items-start h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Header>{header}</Header>
        <div className="flex-auto flex justify-start items-start w-full z-0">
          {/* Left Sidebar */}
          <LeftSidebar>{leftSidebar}</LeftSidebar>
          <MainContentWithRightSidebar
            resizableRightSidebar={resizableRightSidebar}
            rightSidebar={rightSidebar}
            rightSidebarControls={rightSidebarControls}>
            {children}
          </MainContentWithRightSidebar>
        </div>
      </div>
    </StudioLayoutContextProvider>
  )
}
