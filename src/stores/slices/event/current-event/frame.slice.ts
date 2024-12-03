import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  setCurrentFrameIdAction,
  setCurrentSectionIdAction,
} from './event.slice'

import {
  attachThunkToBuilder,
  buildThunkState,
  renameSliceActions,
  ThunkState,
} from '@/stores/helpers'
import { attachStoreListener } from '@/stores/listener'
import {
  bulkUpdateFramesThunk,
  createFramesThunk,
  createFrameThunk,
  deleteFramesThunk,
  deleteFrameThunk,
  getFramesThunk,
  updateFrameThunk,
} from '@/stores/thunks/frame.thunks'
import {
  updateSectionsFramesListThunk,
  updateSectionThunk,
} from '@/stores/thunks/section.thunks'
import { FrameModel } from '@/types/models'

type FrameState = {
  frame: ThunkState<Array<FrameModel>>
  addFrameThunk: ThunkState<FrameModel>
  updateFrameThunk: ThunkState<FrameModel>
  deleteFramesThunk: ThunkState<FrameModel>
}

const initialState: FrameState = {
  frame: buildThunkState<Array<FrameModel>>([]),
  addFrameThunk: buildThunkState<FrameModel>(),
  updateFrameThunk: buildThunkState<FrameModel>(),
  deleteFramesThunk: buildThunkState<FrameModel>(),
}

export const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    insertFrame: (state, action: PayloadAction<FrameModel>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.frame.data?.push(action.payload as any)
    },
    updateFrame: (state, action: PayloadAction<FrameModel>) => {
      state.frame.data =
        state.frame.data?.map((frame) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          frame.id === action.payload.id ? action.payload : (frame as any)
        ) || null
    },

    deleteFrame: (state, action: PayloadAction<FrameModel['id']>) => {
      state.frame.data =
        state.frame.data?.filter((frame) => frame.id !== action.payload) || null
    },
    resetFrame: () => initialState,
  },
  extraReducers: (builder) => {
    attachThunkToBuilder({
      builder,
      thunk: getFramesThunk,
      getThunkState: (state) => state.frame,
    })
    attachThunkToBuilder({
      builder,
      thunk: createFrameThunk,
      getThunkState: (state) => state.addFrameThunk,
    })
    attachThunkToBuilder({
      builder,
      thunk: deleteFramesThunk,
      getThunkState: (state) => state.deleteFramesThunk,
    })
    attachThunkToBuilder({
      builder,
      thunk: updateFrameThunk,
      getThunkState: (state) => state.updateFrameThunk,
      onPending: (state, action) => {
        state.frame.data?.forEach((frame) => {
          if (frame.id === action.meta.arg.frameId) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            frame = { ...frame, ...action.meta.arg.frame }
          }
        })
      },
      onFulfilled: (state, action) => {
        state.frame.data?.forEach((frame) => {
          if (frame.id === action.payload.id) {
            frame = action.payload
          }
        })
      },
    })

    builder.addCase(bulkUpdateFramesThunk.fulfilled, (state, action) => {
      state.frame.data?.forEach((frame) => {
        if (action.payload.frameIds.includes(frame.id)) {
          frame = { ...frame, ...action.payload }
        }
      })
    })
  },
})

attachStoreListener({
  actionCreator: createFrameThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const frameId = action.payload.id
    const sectionId = action.payload.section_id
    const { insertAfterFrameId } = action.meta.arg
    const section =
      getState().event.currentEvent.sectionState.section.data?.find(
        (_section) => _section.id === sectionId
      )

    if (!section) return

    const indexOfInsertAfterFrameId = section.frames?.indexOf(
      insertAfterFrameId || ''
    )

    const newFrameSequence = [...(section?.frames || [])]
    if (indexOfInsertAfterFrameId === -1) {
      newFrameSequence.push(frameId)
    } else if (typeof indexOfInsertAfterFrameId === 'number') {
      newFrameSequence.splice(indexOfInsertAfterFrameId + 1, 0, frameId)
    } else {
      newFrameSequence.push(frameId)
    }
    dispatch(
      updateSectionsFramesListThunk({
        data: [
          {
            id: section.id,
            frames: newFrameSequence,
          },
        ],
      })
    )
    dispatch(setCurrentFrameIdAction(frameId))
    dispatch(setCurrentSectionIdAction(null))
  },
})

attachStoreListener({
  actionCreator: createFramesThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const { sectionId, frames, insertAfterFrameId } = action.meta.arg
    const section =
      getState().event.currentEvent.sectionState.section.data?.find(
        (_section) => _section.id === sectionId
      )

    if (!section) return

    const newFrameIds = frames.map((f: { id: string }) => f!.id)
    const prevFrameIds = section.frames || []
    let newSequence = []

    const indexOfInsertAfterFrameId = insertAfterFrameId
      ? section.frames?.indexOf(insertAfterFrameId)
      : -1

    if (indexOfInsertAfterFrameId !== -1) {
      newSequence = [
        ...prevFrameIds.slice(0, indexOfInsertAfterFrameId! + 1), // Frames before and including insertAfterFrameId
        ...newFrameIds, // The new frames to insert
        ...prevFrameIds.slice(indexOfInsertAfterFrameId! + 1), // Frames after insertAfterFrameId
      ]
    } else {
      // If the frame ID is not found, add newFrames to the end
      newSequence = [...prevFrameIds, ...newFrameIds]
    }

    dispatch(
      updateSectionsFramesListThunk({
        data: [
          {
            id: section.id,
            frames: newSequence,
          },
        ],
      })
    )
    dispatch(setCurrentSectionIdAction(null))
  },
})

attachStoreListener({
  actionCreator: deleteFrameThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const deletedFrameId = action.meta.arg.frameId

    if (!deletedFrameId) return

    const deletedFrame =
      getState().event.currentEvent.frameState.frame.data?.find(
        (frame) => frame.id === deletedFrameId
      )

    if (!deletedFrame) return

    const section =
      getState().event.currentEvent.sectionState.section.data?.find(
        (_section) => _section.id === deletedFrame?.section_id
      )

    if (!section) return

    dispatch(
      updateSectionThunk({
        sectionId: section.id,
        data: {
          frames:
            section.frames?.filter((frameId) => frameId !== deletedFrameId) ||
            [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })
    )
  },
})
attachStoreListener({
  actionCreator: deleteFramesThunk.fulfilled,
  effect: (action, { dispatch, getState }) => {
    const deletedFrameIds = action.meta.arg.frameIds
    const _sectionId = action.meta.arg.sectionId

    const section =
      getState().event.currentEvent.sectionState.section.data?.find(
        (_section) => _section.id === _sectionId
      )

    if (!section) return

    dispatch(
      updateSectionThunk({
        sectionId: section.id,
        data: {
          frames:
            section.frames?.filter(
              (frameId) => !deletedFrameIds.includes(frameId)
            ) || [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })
    )
  },
})
export const {
  updateFrameAction,
  insertFrameAction,
  deleteFrameAction,
  resetFrameAction,
} = renameSliceActions(frameSlice.actions)
