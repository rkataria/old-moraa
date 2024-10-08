import { createSlice } from '@reduxjs/toolkit'

import { renameSliceActions } from '@/stores/helpers'

export type StudioTabType =
  | 'session-planner'
  | 'content-studio'
  | 'landing-page'

export interface StudioLayoutState {
  editing: boolean
  activeTab: StudioTabType
  contentStudioLeftSidebarVisible: boolean
  contentStudioRightSidebar: 'frame-appearance' | 'frame-notes' | null
  contentStudioRightResizableSidebar: 'ai-chat' | null
}

const initialState: StudioLayoutState = {
  editing: false,
  activeTab: 'landing-page',
  contentStudioLeftSidebarVisible: true,
  contentStudioRightSidebar: null,
  contentStudioRightResizableSidebar: null,
}

export const layoutStudioSlice = createSlice({
  name: 'studio-layout',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
    toggleContentStudioLeftSidebarVisible(state) {
      state.contentStudioLeftSidebarVisible =
        !state.contentStudioLeftSidebarVisible
    },
    setContentStudioRightSidebar(state, action) {
      state.contentStudioRightSidebar = action.payload
    },
    setEditing(state, action) {
      state.editing = action.payload
    },
    setContentStudioRightResizableSidebar(state, action) {
      state.contentStudioRightResizableSidebar = action.payload
    },
    resetStudioLayoutState(state) {
      state.activeTab = 'landing-page'
      state.contentStudioLeftSidebarVisible = true
      state.editing = false
      state.contentStudioRightSidebar = null
    },
  },
})

export const {
  setActiveTabAction,
  toggleContentStudioLeftSidebarVisibleAction,
  setContentStudioRightSidebarAction,
  setEditingAction,
  setContentStudioRightResizableSidebarAction,
  resetStudioLayoutStateAction,
} = renameSliceActions(layoutStudioSlice.actions)
