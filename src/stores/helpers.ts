/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ActionReducerMapBuilder,
  AsyncThunk,
  CaseReducer,
  CaseReducerActions,
  Draft,
  ListenerEffect,
  SliceCaseReducers,
  UnknownAction,
} from '@reduxjs/toolkit'

import { initializeStoreAction } from './actions/init'
import { attachStoreListener } from './listener'
import { AppDispatch, RootState } from './store'

import { PostfixKeysWith } from '@/types/common'
import { SectionModel } from '@/types/models'
import { areArraysDifferent } from '@/utils/utils'

export type ThunkState<T, E = any> = {
  data: T | null
  error: E | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export const buildThunkState = <T, E = any>(
  initialData?: T
): ThunkState<T, E> => ({
  data: initialData || null,
  error: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
})

type AttachThunkToBuilder<
  State,
  ThunkFunction extends AsyncThunk<any, any, any>,
> = {
  builder: ActionReducerMapBuilder<State>
  thunk: ThunkFunction
  keepDataWhileLoading?: boolean
  getThunkState: (state: Draft<State>) => Draft<ThunkState<any>>
  onFulfilled?: CaseReducer<State, ReturnType<ThunkFunction['fulfilled']>>
  onPending?: CaseReducer<State, ReturnType<ThunkFunction['pending']>>
  onRejected?: CaseReducer<State, ReturnType<ThunkFunction['rejected']>>
}

export const attachThunkToBuilder = <
  State,
  ThunkFunction extends AsyncThunk<any, any, any>,
>({
  builder,
  thunk,
  keepDataWhileLoading = false,
  getThunkState,
  onFulfilled,
  onPending,
  onRejected,
}: AttachThunkToBuilder<State, ThunkFunction>) => {
  builder
    .addCase(thunk.pending, (state, action) => {
      getThunkState(state).isLoading = true
      getThunkState(state).isError = false
      getThunkState(state).isSuccess = false
      getThunkState(state).error = null
      if (!keepDataWhileLoading) getThunkState(state).data = null
      onPending?.(state, action as any)
    })
    .addCase(thunk.fulfilled, (state, action) => {
      getThunkState(state).isLoading = false
      getThunkState(state).isError = false
      getThunkState(state).isSuccess = true
      getThunkState(state).error = null
      getThunkState(state).data = action.payload
      onFulfilled?.(state, action as any)
    })
    .addCase(thunk.rejected, (state, action) => {
      getThunkState(state).isLoading = false
      getThunkState(state).isError = true
      getThunkState(state).isSuccess = false
      getThunkState(state).error = action.error
      getThunkState(state).data = null
      onRejected?.(state, action as any)
    })

  return builder
}

export const attachOnStoreInitListener = (
  effect: ListenerEffect<UnknownAction, RootState, AppDispatch>
) =>
  attachStoreListener({
    actionCreator: initializeStoreAction,
    effect,
  })

export const getUpdatedSections = (
  oldSections: SectionModel[],
  newSections: SectionModel[]
) => {
  const updatedSections: Array<{ id: string; frames: Array<string> }> = []
  oldSections.forEach((oldSection) => {
    const newFrames = newSections.find(
      (newSection) => newSection.id === oldSection.id
    )
    const areFramesChanged = areArraysDifferent(
      oldSection.frames || [],
      newFrames?.frames || []
    )
    if (areFramesChanged) {
      updatedSections.push({
        id: oldSection.id,
        frames: newFrames?.frames || [],
      })
    }
  })

  return updatedSections
}

export const renameSliceActions = <
  T extends SliceCaseReducers<any>,
  T2 extends string,
>(
  actions: CaseReducerActions<T, T2>
): PostfixKeysWith<CaseReducerActions<T, T2>, 'Action'> => {
  const exportActions = {} as PostfixKeysWith<
    CaseReducerActions<T, T2>,
    'Action'
  >

  Object.entries(actions).forEach(
    // eslint-disable-next-line no-return-assign
    ([actionName, actionFunction]) =>
      ((exportActions as any)[`${actionName}Action`] = actionFunction)
  )

  return exportActions
}
