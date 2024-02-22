"use client"

import React from "react"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "next-themes"
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ModalProvider } from "@/providers/modal-provider"
import { UserContextProvider } from "@/hooks/useAuth"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        storageKey="moraa-theme"
      >
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              {children}
              <Toaster position="bottom-right" reverseOrder={false} />
              <ModalProvider />
            </UserContextProvider>
          </QueryClientProvider>
        </ChakraProvider>
      </ThemeProvider>
    </>
  )
}
