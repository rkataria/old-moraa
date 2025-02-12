import { ContentStudioBottomOverlay } from './ContentStudioButtomOverlay'
import { ContentStudioContentContainer } from './ContentStudioContentContainer'
import { ContentStudioLeftSidebar } from './ContentStudioLeftSidebar'
import { ContentStudioRightSidebar } from './ContentStudioRightSidebar'

import { WithAIChatPanel } from '@/components/event-content/WithAIChatPanel'

const StudioLayoutHeaderHeight = 56

export function ContentStudio() {
  return (
    <div
      className="w-full p-2 py-3 flex justify-start items-start gap-2"
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
    </div>
  )
}
