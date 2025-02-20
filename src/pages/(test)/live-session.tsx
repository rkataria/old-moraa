/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { GalleryGrid } from './gallery-grid'

import { cn } from '@/utils/utils'

export const Route = createFileRoute('/(test)/live-session')({
  component: LiveSession,
})

function LiveSession() {
  const [focus, setFocus] = useState(false)

  return (
    <div className="w-full h-screen flex flex-col">
      <Header hidden={focus} />
      <div
        className={cn('w-full h-full transition-all flex flex-row', {
          'pt-12 pb-12': !focus,
        })}>
        <LeftSidebar hidden={focus} />
        <Content
          toggleFocus={() => {
            setFocus(!focus)
          }}
        />
        <RightSidebar hidden={focus} />
      </div>
      <Footer hidden={focus} />
    </div>
  )
}
function Header({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 w-full h-12 bg-red-500 transition-all',
        {
          '-top-12': hidden,
        }
      )}
    />
  )
}

function Footer({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full h-12 bg-red-500 transition-all',
        {
          '-bottom-12': hidden,
        }
      )}
    />
  )
}

function LeftSidebar({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={cn('w-56 h-full bg-blue-500 transition-all', {
        '-ml-56': hidden,
      })}>
      Left
    </div>
  )
}

function RightSidebar({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={cn('w-56 h-full bg-blue-500 transition-all', {
        '-mr-56': hidden,
      })}>
      Right
    </div>
  )
}

function Content({ toggleFocus }: { toggleFocus: () => void }) {
  return (
    <div className="flex-1" onClick={toggleFocus}>
      <GalleryGrid />
    </div>
  )
}
