import React from 'react'

import data from '@emoji-mart/data/sets/14/apple.json'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { init } from 'emoji-mart'
// TODO: React - Fix this theme
// import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { Provider as ReduxProvider } from 'react-redux'

import { LiveblocksProvider } from './LiveblocksProvider'
import { MoraaSlideEditorContextProvider } from './MoraaSlideEditorContext'

import { UserContextProvider } from '@/hooks/useAuth'
import { store } from '@/stores/store'

init({ data })

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <MoraaSlideEditorContextProvider>
              <LiveblocksProvider>
                <main className="moraa-light text-foreground bg-background">
                  {children}
                </main>
              </LiveblocksProvider>
              <Toaster position="top-center" reverseOrder={false} />
            </MoraaSlideEditorContextProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </NextUIProvider>
    </ReduxProvider>
  )
}
