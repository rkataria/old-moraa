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
    <div
      className="flex flex-col justify-start items-start w-full h-screen overflow-hidden bg-white"
      style={
        {
          // backgroundImage:
          //   'radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%)',
          // backgroundBlendMode: 'screen',
        }
      }>
      <Header>{header}</Header>
      <div className="flex-auto flex justify-start items-start gap-4 w-full overflow-hidden pb-3">
        <LeftSidebar>{leftSidebar}</LeftSidebar>
        <Content>{children}</Content>
        <RightSidebar>{rightSidebar}</RightSidebar>
      </div>
      <Footer>{footer}</Footer>
    </div>
  )
}
