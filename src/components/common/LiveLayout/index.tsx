import { ReactNode } from 'react'

import { Content } from './Content'
import { Footer } from './Footer'
import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'

type LiveLayoutProps = {
  children: ReactNode
  header: ReactNode
  leftSidebar: ReactNode
  rightSidebar: ReactNode
  footer: ReactNode
}

export function LiveLayout({
  children,
  header,
  leftSidebar,
  rightSidebar,
  footer,
}: LiveLayoutProps) {
  return (
    <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden bg-gray-100">
      <Header>{header}</Header>
      <div className="flex-auto flex justify-start items-start gap-2 w-full overflow-hidden z-0">
        <LeftSidebar>{leftSidebar}</LeftSidebar>
        <Content>{children}</Content>
        <RightSidebar>{rightSidebar}</RightSidebar>
      </div>
      <Footer>{footer}</Footer>
    </div>
  )
}
