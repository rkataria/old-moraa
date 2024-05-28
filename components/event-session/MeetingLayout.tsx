/* eslint-disable react/button-has-type */
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { FlyingEmojisOverlay } from './FlyingEmojisOverlay'

import { cn } from '@/utils/utils'

export function MeetingLayoutRoot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col w-full h-screen max-h-screen dark:bg-[#202124] bg-white overflow-hidden'
      )}
      style={{
        backgroundColor: 'var(--slide-bg-color)',
      }}>
      {children}
      <FlyingEmojisOverlay />
    </div>
  )
}

export function MeetingBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-auto w-full h-[calc(100vh_-_64px)]">
      {children}
    </div>
  )
}

export function MeetingLeftSidebarWrapper({
  children,
  visible,
  toggleLeftSidebar,
}: {
  children: React.ReactNode
  visible: boolean
  toggleLeftSidebar: () => void
}) {
  return (
    <div
      className={cn(
        'w-full h-full relative flex-none transition-all duration-300 ease-in-out max-h-[calc(100vh_-_64px)] border-r-2 border-gray-200 bg-white'
      )}>
      {visible ? children : null}

      <button
        className="absolute -right-4 top-20 -translate-y-1/2 z-[1] p-1 aspect-square rounded-full border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out"
        onClick={toggleLeftSidebar}>
        {visible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  )
}

export function MeetingRightSidebarWrapper({
  children,
  visible,
}: {
  children: React.ReactNode
  visible: boolean
}) {
  return (
    <div
      className={cn(
        'h-full flex-none transition-all duration-300 ease-in-out overflow-hidden max-h-[calc(100vh_-_64px)] bg-white border-l-2 border-gray-200',
        { 'w-full': visible, 'w-0': !visible }
      )}>
      {children}
    </div>
  )
}
