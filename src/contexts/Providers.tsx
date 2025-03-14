import React from 'react'

import data from '@emoji-mart/data/sets/14/apple.json'
import { HeroUIProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { init } from 'emoji-mart'
// TODO: React - Fix this theme
// import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { Provider as ReduxProvider } from 'react-redux'

import { ConfirmationModalProvider } from './ConfirmationModalContext'
import { LiveblocksProvider } from './LiveblocksProvider'
import { MoraaSlideEditorContextProvider } from './MoraaSlideEditorContext'

import { AppContextProvider } from '@/hooks/useApp'
import { UserContextProvider } from '@/hooks/useAuth'
import { store } from '@/stores/store'

init({ data })

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <AppContextProvider>
              <MoraaSlideEditorContextProvider>
                <LiveblocksProvider>
                  <main className="moraa-light text-foreground bg-background">
                    <ConfirmationModalProvider>
                      {children}
                    </ConfirmationModalProvider>
                  </main>
                </LiveblocksProvider>
                <Toaster position="bottom-right" reverseOrder={false} />
              </MoraaSlideEditorContextProvider>
            </AppContextProvider>
          </UserContextProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </ReduxProvider>
  )
}
