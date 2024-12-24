import { ReactNode } from 'react'

import { Content } from './Content'

type RecordingLayoutProps = {
  children: ReactNode
}

export function RecordingLayout({ children }: RecordingLayoutProps) {
  return (
    <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden bg-live">
      <div className="flex-auto flex justify-start items-start gap-4 w-full overflow-hidden py-3">
        <Content>{children}</Content>
      </div>
    </div>
  )
}
