"use client"

import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { ChakraProvider } from "@chakra-ui/react"
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        storageKey="elearning"
      >
        <UseQueryProvider>
          <ChakraProvider>{children}</ChakraProvider>

          <ModalProvider />
          <Toaster position="bottom-right" reverseOrder={false} />
        </UseQueryProvider>
      </ThemeProvider>
    </>
  )
}
