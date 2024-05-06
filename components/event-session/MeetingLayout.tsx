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
  setLeftSidebarVisible,
}: {
  children: React.ReactNode
  visible: boolean
  setLeftSidebarVisible: (visible: boolean) => void
}) {
  return (
    <div
      className={cn(
        'relative flex-none transition-all duration-300 ease-in-out max-h-[calc(100vh_-_64px)] border-r-2 border-gray-200 bg-white',
        {
          'w-5': !visible,
          'w-72': visible,
        }
      )}>
      {visible ? children : null}

      <button
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-[1] p-1 aspect-square rounded-full border-2 border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 ease-in-out"
        onClick={() => setLeftSidebarVisible(!visible)}>
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
        'flex-none transition-all duration-300 ease-in-out overflow-hidden max-h-[calc(100vh_-_64px)] bg-white',
        {
          'w-72': visible,
          'w-0': !visible,
        }
      )}>
      {children}
    </div>
  )
}
