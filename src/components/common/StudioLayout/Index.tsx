import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { ContentStudio } from './ContentStudio'
import { Header } from './Header'
import { LandingPage } from './LandingPage'
import { SecondaryHeader } from './SecondaryHeader'
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
        <div className="w-full h-full bg-white">
          <LandingPage />
        </div>
      )
    }
    if (activeTab === 'session-planner') {
      return (
        <div className="w-full h-full bg-white">
          <div className="mx-auto h-full max-w-screen-2xl py-10 overflow-y-auto scrollbar-thin">
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
      gradientStyle="var(--studio-background)">
      <div className="flex flex-col justify-start items-start w-full h-screen overflow-hidden backdrop-blur-3xl">
        <div className="flex-none w-full border-b-2 border-gray-200 bg-white sticky top-0 z-50">
          <Header>{header}</Header>
          <SecondaryHeader />
        </div>
        <div className="flex-auto w-full overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </BackgroundContainer>
  )
}
