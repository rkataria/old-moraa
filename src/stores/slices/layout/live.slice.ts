import { createSlice } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

export interface LiveLayoutState {
  leftSidebarMode: 'maximized' | 'minimized' | 'collapsed'
  rightSidebarMode: 'participants' | 'chat' | 'plugins' | 'frame-notes' | null
}

const initialState: LiveLayoutState = {
  leftSidebarMode: 'collapsed',
  rightSidebarMode: null,
}

export const layoutLiveSlice = createSlice({
  name: 'live-layout',
  initialState,
  reducers: {
    minimizeLeftSidebar(state) {
      state.leftSidebarMode = 'minimized'
    },
    maximizeLeftSidebar(state) {
      state.leftSidebarMode = 'maximized'
    },
    collapseLeftSidebar(state) {
      state.leftSidebarMode = 'collapsed'
    },
    toggleLeftSidebar(state) {
      // Toggle between collapsed and maximized
      if (state.leftSidebarMode === 'collapsed') {
        state.leftSidebarMode = 'maximized'
      } else {
        state.leftSidebarMode = 'collapsed'
      }
    },
    setRightSidebar(state, action) {
      state.rightSidebarMode = action.payload
    },
    closeRightSidebar(state) {
      state.rightSidebarMode = null
    },
  },
})

export const {
  minimizeLeftSidebarAction,
  maximizeLeftSidebarAction,
  collapseLeftSidebarAction,
  toggleLeftSidebarAction,
  setRightSidebarAction,
  closeRightSidebarAction,
} = renameSliceActions(layoutLiveSlice.actions)
