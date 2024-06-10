import { Header } from './StudioLayout/Header'
import { LeftSidebar } from './StudioLayout/LeftSidebar'
import { MainContentWithRightSidebar } from './StudioLayout/MainContentWithRightSidebar'

import { StudioLayoutContextProvider } from '@/hooks/useStudioLayout'

type StudioLayoutProps = {
  children: React.ReactNode
  header: React.ReactNode
  leftSidebar: React.ReactNode
  rightSidebar: React.ReactNode
}

export function StudioLayout({
  children,
  header,
  leftSidebar,
  rightSidebar,
}: StudioLayoutProps) {
  return (
    <StudioLayoutContextProvider>
      <div className="flex flex-col justify-start items-start h-screen overflow-hidden bg-white dark:bg-gray-900">
        <Header>{header}</Header>
        <div className="flex-auto flex justify-start items-start w-full z-0">
          {/* Left Sidebar */}
          <LeftSidebar>{leftSidebar}</LeftSidebar>
          <MainContentWithRightSidebar rightSidebar={rightSidebar}>
            {children}
          </MainContentWithRightSidebar>
        </div>
      </div>
    </StudioLayoutContextProvider>
  )
}
