import { createSlice } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

export type ContentTilesLayout = 'default' | 'spotlight' | 'sidebar' | 'topbar'
export type MaxTilesPerPage = 6 | 9 | 12 | 18 | 27 | 36

export interface LiveLayoutState {
  leftSidebarMode: 'maximized' | 'minimized' | 'collapsed'
  rightSidebarMode: 'participants' | 'chat' | 'plugins' | 'frame-notes' | null
  changeContentTilesLayoutModalOpen: boolean
  contentTilesLayoutConfig: {
    layout: ContentTilesLayout
    hideSelfTile?: boolean
    maxTilesPerPage: MaxTilesPerPage
    hideTilesWithNoVideo?: boolean
  }
}

const initialState: LiveLayoutState = {
  leftSidebarMode: 'maximized',
  rightSidebarMode: null,
  changeContentTilesLayoutModalOpen: false,
  contentTilesLayoutConfig: { layout: 'default', maxTilesPerPage: 6 },
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

    // Change content tiles layout modal
    openChangeContentTilesLayoutModal(state) {
      state.changeContentTilesLayoutModalOpen = true
    },
    closeChangeContentTilesLayoutModal(state) {
      state.changeContentTilesLayoutModalOpen = false
    },

    // Change content tiles layout
    changeContentTilesLayoutConfig(state, action) {
      state.contentTilesLayoutConfig = {
        ...state.contentTilesLayoutConfig,
        ...action.payload,
      }
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
  openChangeContentTilesLayoutModalAction,
  closeChangeContentTilesLayoutModalAction,
  changeContentTilesLayoutConfigAction,
} = renameSliceActions(layoutLiveSlice.actions)
