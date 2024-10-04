import { ContentStudioBottomOverlay } from './ContentStudioButtomOverlay'
import { ContentStudioFrameContainer } from './ContentStudioFrameContainer'
import { ContentStudioLeftSidebar } from './ContentStudioLeftSidebar'
import { ContentStudioRightSidebar } from './ContentStudioRightSidebar'
import { ContentStudioRightSidebarControls } from './ContentStudioRightSidebarControls'

const StudioLayoutHeaderHeight = 96

export function ContentStudio() {
  return (
    <div
      className="w-full p-2 flex justify-start items-start gap-2"
      style={{
        height: `calc(100vh - ${StudioLayoutHeaderHeight}px)`,
      }}>
      <ContentStudioLeftSidebar />
      <div className="flex-auto h-full">
        {/* <ContentStudioHeader /> */}
        <ContentStudioFrameContainer />
        <ContentStudioBottomOverlay />
      </div>
      <ContentStudioRightSidebar />
      <ContentStudioRightSidebarControls />
    </div>
  )
}
