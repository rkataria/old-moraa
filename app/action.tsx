/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { ReactNode } from 'react'

import { openai } from '@ai-sdk/openai'
import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export interface ServerMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  display: ReactNode
}

export async function continueConversation(
  input: string,
  sectionId: string
): Promise<ClientMessage> {
  'use server'

  const history = getMutableAIState()

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ])
      }

      return <div>{content}</div>
    },
    tools: {
      // Tool for generating a poll
      generate_poll: {
        description: 'Generate a poll about a given topic',
        parameters: z.object({
          topic: z.string().describe('The topic for the poll, e.g., Jupiter'),
        }),
        generate: async function* generate({ topic }) {
          yield <div>Generating poll for {topic}...</div>
          // Assume generatePoll is implemented and returns an object with the structure expected by PollCard
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const poll = await generatePoll(topic, sectionId)

          return <div>{poll}</div>
        },
      },
    },
  })

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  }
}

async function generatePoll(topic: string, sectionId: string): Promise<any> {
  console.log(`Generating poll for ${topic}...`)

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/generations/generate-poll`

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await axios.post(url, null, {
      params: {
        topic,
        section_id: sectionId,
      },
    })

    return 'Created a poll!! Want to create more? Go ahead and tell me'
  } catch (error) {
    console.error('Error generating poll:', error)

    return 'Some error occurred while creating the poll. Please try again later.'
  }
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
})
