"use client"

import React from "react"
import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { UserContextProvider } from "@/hooks/useAuth"
import { Toaster } from 'react-hot-toast'

const theme = extendTheme({
  colors: {
    brand: {
      500: "#7C3AED",
    },
    black: {
      500: "#000",
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        storageKey="elearning"
      >
        <ChakraProvider theme={theme}>
          <UseQueryProvider>
            <UserContextProvider>
              {children}
              <Toaster position="bottom-right" reverseOrder={false} />
              <ModalProvider />
            </UserContextProvider>
          </UseQueryProvider>
        </ChakraProvider>
      </ThemeProvider>
    </>
  )
}
