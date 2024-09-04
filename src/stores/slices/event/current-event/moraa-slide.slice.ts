import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

type MoraaSlideState = {
  activeObject: fabric.Object | undefined
  setActiveObject: (object: fabric.Object | undefined) => void
}

const initialState: MoraaSlideState = {
  activeObject: undefined,
  setActiveObject: () => {},
}

export const moraaSlideSlice = createSlice({
  name: 'moraa-slide',
  initialState,
  reducers: {
    setActiveObject: (
      state,
      action: PayloadAction<fabric.Object | undefined>
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.activeObject = action.payload as any
    },
  },
})

export const { setActiveObjectAction } = renameSliceActions(
  moraaSlideSlice.actions
)
