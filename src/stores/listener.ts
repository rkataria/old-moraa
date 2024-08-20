import {
  createListenerMiddleware,
  TypedStartListening,
  TypedStopListening,
} from '@reduxjs/toolkit'

import type { AppDispatch, RootState } from './store'

export const listenerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispatch>
type AppStopListening = TypedStopListening<RootState, AppDispatch>

export const attachStoreListener =
  listenerMiddleware.startListening as AppStartListening
export const detachStoreListener =
  listenerMiddleware.stopListening as AppStopListening
