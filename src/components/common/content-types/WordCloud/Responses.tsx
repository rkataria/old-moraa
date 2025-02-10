import { ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'
import groupBy from 'lodash.groupby'
import uniqBy from 'lodash.uniqby'

import { WordCloud } from './WordsPreview'

import { FrameResponseService } from '@/services/frame-response.service'
import { IFrame } from '@/types/frame.type'
import { getAvatarForName } from '@/utils/utils'

export function Responses({
  frame,
  responses,
  placeholder,
}: {
  frame: IFrame
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responses?: any
  placeholder?: ReactNode
}) {
  const wordCloudResponseQuery = useQuery({
    queryKey: ['frame-response-word-cloud', frame.id],
    queryFn: () => FrameResponseService.getResponses(frame.id),
    enabled: !!frame.id && !responses,
    refetchOnWindowFocus: false,
  })

  const responsesFromQuery = wordCloudResponseQuery.data?.responses

  const wordResponses = !responses ? responsesFromQuery : responses

  const wordsWithParticipants = [].concat(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(wordResponses || []).map((response: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.response.words.map((word: any) => ({
        text: word,
        participant: response.participant,
      }))
    )
  )

  const groupedWords = groupBy(wordsWithParticipants, 'text')

  const wordsWithCount = Object.keys(groupedWords).map((text) => {
    const entries = groupedWords[text]

    return {
      text,
      count: entries.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      participants: uniqBy(entries, (entry: any) => entry.participant.id).map(
        (entry) => ({
          id: entry.participant.id,
          name: `${entry.participant.enrollment.profile.first_name} ${entry.participant.enrollment.profile.last_name}`,
          email: entry.participant.enrollment.profile.email,
          avatar_url: getAvatarForName(
            `${entry.participant.enrollment.profile.first_name} ${entry.participant.enrollment.profile.last_name}`,
            entry.participant.enrollment.profile.avatar_url
          ),
        })
      ),
    }
  })

  if (wordResponses?.length === 0) {
    return placeholder
  }

  return (
    <div className="flex flex-col mt-4">
      <p className="text-gray-600 mb-4">
        {wordResponses?.length} responses captured during live session
      </p>
      <div className="h-full w-full">
        <WordCloud
          words={wordsWithCount.map((word) => ({
            text: word.text,
            value: word.count,
            participants: word.participants,
          }))}
          colors={frame.config.colors}
        />
      </div>
    </div>
  )
}
