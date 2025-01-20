export interface LoadingWrapperProps {
  label?: string
  classNames?: {
    overlay?: string
  }
}

export interface LoaderProps extends LoadingWrapperProps {
  hasOverlay?: boolean
}
