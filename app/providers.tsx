"use client"

import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { ChakraProvider } from "@chakra-ui/react"

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
        </UseQueryProvider>
      </ThemeProvider>
    </>
  )
}
