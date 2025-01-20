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
  contentStudioRightSidebarVisible: boolean
  contentStudioRightSidebar:
    | 'frame-settings'
    | 'frame-appearance'
    | 'frame-notes'
    | null
  contentStudioRightResizableSidebar: 'ai-chat' | null
  expandedSections: string[]
  agendaPanelDisplayType: 'list' | 'grid'
  frameSettings: {
    view: 'form' | 'preview'
  }
}

const initialState: StudioLayoutState = {
  editing: false,
  activeTab: 'landing-page',
  contentStudioLeftSidebarVisible: true,
  contentStudioRightSidebarVisible: true,
  contentStudioRightSidebar: null,
  contentStudioRightResizableSidebar: null,
  expandedSections: [],
  agendaPanelDisplayType: 'grid',
  frameSettings: {
    view: 'form',
  },
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
    toggleContentStudioRightSidebarVisible(state) {
      state.contentStudioRightSidebarVisible =
        !state.contentStudioRightSidebarVisible
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
    setExpandedSections(state, action) {
      state.expandedSections = action.payload
    },
    setAgendaPanelDisplayType(state, action) {
      state.agendaPanelDisplayType = action.payload
    },

    setFrameSettingsView(state, action) {
      state.frameSettings.view = action.payload
    },
  },
})

export const {
  setActiveTabAction,
  toggleContentStudioLeftSidebarVisibleAction,
  toggleContentStudioRightSidebarVisibleAction,
  setContentStudioRightSidebarAction,
  setEditingAction,
  setContentStudioRightResizableSidebarAction,
  resetStudioLayoutStateAction,
  setAgendaPanelDisplayTypeAction,
  setExpandedSectionsAction,
  setFrameSettingsViewAction,
} = renameSliceActions(layoutStudioSlice.actions)
