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
  bulkUpdateFrameStatusThunk,
  createFrameThunk,
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
}

const initialState: FrameState = {
  frame: buildThunkState<Array<FrameModel>>([]),
  addFrameThunk: buildThunkState<FrameModel>(),
  updateFrameThunk: buildThunkState<FrameModel>(),
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

    builder.addCase(bulkUpdateFrameStatusThunk.fulfilled, (state, action) => {
      state.frame.data?.forEach((frame) => {
        if (action.payload.frameIds.includes(frame.id)) {
          frame.status = action.payload.status
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

export const { updateFrameAction, insertFrameAction, deleteFrameAction } =
  renameSliceActions(frameSlice.actions)
