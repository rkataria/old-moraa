import React, { PropsWithChildren } from 'react'

import {
  FallbackRender,
  ErrorBoundary as SentryErrorBoundary,
} from '@sentry/react'

import { Error } from './Error'

interface ErrorBoundaryProps {
  renderFallback?: FallbackRender | React.ReactElement
}

export function ErrorBoundary({
  children,
  renderFallback = () => <Error />,
}: PropsWithChildren<ErrorBoundaryProps>) {
  return (
    <SentryErrorBoundary
      key={window.location.pathname}
      fallback={renderFallback}>
      {children}
    </SentryErrorBoundary>
  )
}
