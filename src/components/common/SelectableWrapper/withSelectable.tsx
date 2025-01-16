import React from 'react'

import { useSelectable, UseSelectableReturn } from './useSelectable'

export function withSelectable<T>(
  WrappedComponent: React.ComponentType<{ selection: UseSelectableReturn<T> }>
) {
  return function WithSelectableComponent(
    props: Omit<React.ComponentProps<typeof WrappedComponent>, 'selection'>
  ) {
    const selectionState = useSelectable<T>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <WrappedComponent {...(props as any)} selection={selectionState} />
  }
}
