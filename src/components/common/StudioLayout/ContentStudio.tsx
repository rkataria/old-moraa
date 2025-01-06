import { ContentStudioBottomOverlay } from './ContentStudioButtomOverlay'
import { ContentStudioContentContainer } from './ContentStudioContentContainer'
import { ContentStudioLeftSidebar } from './ContentStudioLeftSidebar'
import { ContentStudioRightSidebar } from './ContentStudioRightSidebar'
import { ContentStudioRightSidebarControls } from './ContentStudioRightSidebarControls'

import { WithAIChatPanel } from '@/components/event-content/WithAIChatPanel'

const StudioLayoutHeaderHeight = 56

export function ContentStudio() {
  return (
    <div
      className="w-full p-4 flex justify-start items-start gap-4"
      style={{
        height: `calc(100vh - ${StudioLayoutHeaderHeight}px)`,
      }}>
      <ContentStudioLeftSidebar />
      <div className="flex-auto h-full">
        <WithAIChatPanel>
          <ContentStudioContentContainer />
          <ContentStudioBottomOverlay />
        </WithAIChatPanel>
      </div>
      <ContentStudioRightSidebar />
      <ContentStudioRightSidebarControls />
    </div>
  )
}
