import { createSlice } from '@reduxjs/toolkit'
import { ReactNode } from '@tanstack/react-router'

import { renameSliceActions } from '@/stores/helpers'
import { fetchChatThunk } from '@/stores/thunks/ai.thunk'

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  content: ReactNode
}

export interface ChatState {
  messages: ClientMessage[]
  input: string
  loading: boolean
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  input: '',
  loading: false,
  error: null,
}

export const aiChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInput(state, action) {
      state.input = action.payload
    },
    addMessage(state, action) {
      state.messages.push(action.payload)
    },
    addMessageInBulk(state, action) {
      state.messages = state.messages.concat(action.payload)
    },

    updateMessage(state, action) {
      state.messages = state.messages.map((message) => {
        if (message.id === action.payload.id) {
          return action.payload
        }

        return message
      })
    },
    setMessages(state, action) {
      state.messages = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChatThunk.fulfilled, (state, action) => {
        state.messages.push({
          id: new Date().toISOString(),
          role: 'assistant',
          content: action.payload,
        })
        state.loading = false
      })
      .addCase(fetchChatThunk.rejected, (state, action) => {
        state.messages.push({
          id: new Date().toISOString(),
          role: 'assistant',
          content: action.payload as string,
        })
        state.loading = false
      })
  },
})

export const {
  setInputAction,
  addMessageAction,
  addMessageInBulkAction,
  updateMessageAction,
  addMessageInBulk2Action,
  setMessagesAction,
} = renameSliceActions(aiChatSlice.actions)
