"use client"

import React from "react"
import { UseQueryProvider } from "@/utils/use-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { ModalProvider } from "@/providers/modal-provider"
import {
  ChakraProvider,
} from "@chakra-ui/react"
import { SaasProvider } from "@saas-ui/react"
import { supabaseClient } from "@/utils/supabase/client"
import { AuthProvider } from "@saas-ui/auth"
import { createAuthService } from "@saas-ui/supabase"
import Link, { LinkProps } from "next/link"

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
            <AuthProvider
              {...createAuthService(supabaseClient, {
                loginOptions: {
                  redirectTo: "/dashboard",
                  shouldCreateUser: false,
                },
              })}
            >
              <UseQueryProvider>
                {children}
                <ModalProvider />
              </UseQueryProvider>
            </AuthProvider>
          </SaasProvider>
        </ChakraProvider>
      </ThemeProvider>
    </>
  )
}
