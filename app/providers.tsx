'use client'

import React from 'react'

import data from '@emoji-mart/data/sets/14/apple.json'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { init } from 'emoji-mart'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

import { NextUIProvider } from '@nextui-org/react'

import { UserContextProvider } from '@/hooks/useAuth'
import { ReduxProvider } from '@/stores/redux-provider'

init({ data })

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={false}
      storageKey="moraa-theme">
      <ReduxProvider>
        <NextUIProvider>
          <NextUIProvider>
            <QueryClientProvider client={queryClient}>
              <UserContextProvider>
                {children}
                <Toaster position="bottom-right" reverseOrder={false} />
              </UserContextProvider>
            </QueryClientProvider>
          </NextUIProvider>
        </NextUIProvider>
      </ReduxProvider>
    </ThemeProvider>
  )
}
