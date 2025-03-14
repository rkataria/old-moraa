import { configureStore } from '@reduxjs/toolkit'

import { initializeStoreAction } from './actions/init'
import { listenerMiddleware } from './listener'
import { combinedAiReducer } from './slices/ai'
import { combinedEventReducer } from './slices/event'
import { combinedLayoutReducer } from './slices/layout'
import { combinedUserReducer } from './slices/user'

export const store = configureStore({
  reducer: {
    event: combinedEventReducer,
    user: combinedUserReducer,
    ai: combinedAiReducer,
    layout: combinedLayoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // NOTE: Adding this to allow to store moraa slide active object instance in redux store
    }).prepend(listenerMiddleware.middleware),
  devTools: true,
})

store.dispatch(initializeStoreAction())

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
