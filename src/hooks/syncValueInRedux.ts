import { useEffect } from 'react'

import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

import { useStoreDispatch, useStoreSelector } from './useRedux'

type UseSyncValueInRedux<T> = {
  value: T
  reduxStateSelector: Parameters<typeof useStoreSelector>[0]
} & (
  | {
      actionFn: ActionCreatorWithPayload<T>
      onValueUpdated?: never
    }
  | {
      actionFn?: never
      onValueUpdated: (data: {
        value: T
        dispatch: ReturnType<typeof useStoreDispatch>
      }) => void
    }
)

export function useSyncValueInRedux<T>({
  value,
  reduxStateSelector,
  actionFn,
  onValueUpdated,
}: UseSyncValueInRedux<T>) {
  const reduxValue = useStoreSelector(reduxStateSelector)
  const dispatch = useStoreDispatch()

  useEffect(() => {
    if (value !== reduxValue) {
      if (onValueUpdated) onValueUpdated({ value, dispatch })
      if (actionFn) dispatch(actionFn(value))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxValue, value])
}
