import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { ContentStudio } from './ContentStudio'
import { Header } from './Header'
import { LandingPage } from './LandingPage'

import { SessionPlanner } from '@/components/event-content/overview-frame/SessionPlanner/SessionPlanner'
import { WithAIChatPanel } from '@/components/event-content/WithAIChatPanel'
import { useStoreSelector } from '@/hooks/useRedux'
import { resetStudioLayoutStateAction } from '@/stores/slices/layout/studio.slice'

type StudioLayoutProps = {
  header: React.ReactNode
}

export function StudioLayout({ header }: StudioLayoutProps) {
  const activeTab = useStoreSelector((state) => state.layout.studio.activeTab)
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetStudioLayoutStateAction())
    },
    [dispatch]
  )

  const renderContent = () => {
    if (activeTab === 'landing-page') {
      return (
        <div className="w-full h-full p-4 bg-transparent rounded-md">
          <WithAIChatPanel>
            <LandingPage />
          </WithAIChatPanel>
        </div>
      )
    }
    if (activeTab === 'session-planner') {
      return (
        <div className="w-full h-full p-4 max-w-screen-3xl overflow-y-auto scrollbar-none bg-transparent rounded-md">
          <WithAIChatPanel>
            <SessionPlanner />
          </WithAIChatPanel>
        </div>
      )
    }
    if (activeTab === 'content-studio') {
      return <ContentStudio />
    }

    return null
  }

  return (
    <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden bg-studio">
      <div className="flex-none w-full sticky top-0 z-50">
        <Header>{header}</Header>
      </div>
      <div className="flex-auto w-full overflow-hidden">{renderContent()}</div>
    </div>
  )
}
