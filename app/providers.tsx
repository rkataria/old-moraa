"use client"

import React from "react"
import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"
import { ChakraProvider } from "@chakra-ui/react"
import { SaasProvider } from "@saas-ui/react"
import Link, { LinkProps } from "next/link"
import { UserContextProvider } from "@/hooks/useAuth"

const NextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link ref={ref} {...props} />
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        storageKey="elearning"
      >
        <ChakraProvider>
          <SaasProvider linkComponent={NextLink}>
            <UserContextProvider>
              <UseQueryProvider>
                {children}
                <ModalProvider />
              </UseQueryProvider>
            </UserContextProvider>
          </SaasProvider>
        </ChakraProvider>
      </ThemeProvider>
    </>
  )
}
