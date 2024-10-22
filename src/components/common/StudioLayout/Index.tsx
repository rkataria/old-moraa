import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { ContentStudio } from './ContentStudio'
import { Header } from './Header'
import { LandingPage } from './LandingPage'
import { BackgroundContainer } from '../BackgroundContainer'

import { SessionPlanner } from '@/components/event-content/overview-frame/SessionPlanner/SessionPlanner'
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
        <div className="w-full h-full p-2">
          <div className="w-full h-full bg-white rounded-md">
            <LandingPage />
          </div>
        </div>
      )
    }
    if (activeTab === 'session-planner') {
      return (
        <div className="w-full h-full p-2">
          <div className="h-full max-w-screen-3xl pb-10 pt-4 overflow-y-auto scrollbar-thin bg-white rounded-md">
            <SessionPlanner />
          </div>
        </div>
      )
    }
    if (activeTab === 'content-studio') {
      return <ContentStudio />
    }

    return null
  }

  return (
    <BackgroundContainer
      animateLogo={false}
      gradientStyle="white"
      showLogo={false}>
      <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden backdrop-blur-3xl">
        <div className="flex-none w-full sticky top-0 z-50">
          <Header>{header}</Header>
        </div>
        <div className="flex-auto w-full overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </BackgroundContainer>
  )
}
