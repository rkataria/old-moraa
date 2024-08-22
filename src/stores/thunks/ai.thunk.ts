import { createAsyncThunk } from '@reduxjs/toolkit'
import { ReactNode } from '@tanstack/react-router'

import { ChatState } from '../slices/ai/ai.slice'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const MODEL = 'gpt-3.5-turbo'

export const fetchChatResponse = createAsyncThunk<string, string>(
  'chat/fetchChatResponse',
  async (input: string, { getState, rejectWithValue }) => {
    const state = getState() as { ai: { chat: ChatState } }
    const { messages } = state.ai.chat

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              ...messages.map((msg: ReactNode | string) => ({
                role: msg.role,
                content: msg.content.toString(),
              })),
              { role: 'user', content: input },
            ],
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      return data.choices[0].message.content
    } catch (error) {
      console.log('error', error)

      return rejectWithValue('Error: Unable to get response')
    }
  }
)
