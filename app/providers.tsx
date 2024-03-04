'use client'

import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

import { NextUIProvider } from '@nextui-org/react'

import { UserContextProvider } from '@/hooks/useAuth'
import { ModalProvider } from '@/providers/modal-provider'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={false}
      storageKey="moraa-theme">
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            {children}
            <Toaster position="bottom-right" reverseOrder={false} />
            <ModalProvider />
          </UserContextProvider>
        </QueryClientProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}
