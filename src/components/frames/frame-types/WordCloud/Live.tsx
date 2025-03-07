import { useState } from 'react'

import { Chip, Input } from '@heroui/react'

import { Responses } from './Responses'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { Button } from '@/components/ui/Button'
import { useEventSession } from '@/contexts/EventSessionContext'
import { useStoreSelector } from '@/hooks/useRedux'
import { IFrame, IWordCloudResponse } from '@/types/frame.type'

export function Live({ frame }: { frame: IFrame }) {
  const [word, setWord] = useState('')
  const [error, setError] = useState('')
  const currentUser = useStoreSelector((state) => state.user.currentUser.user)

  const maxWordsCount = frame.config?.maxWords

  const {
    currentFrameResponses = [] as IWordCloudResponse[],
    onAddWordsInCloud,
    onUpdateWordsInCloud,
  } = useEventSession()

  const responses: IWordCloudResponse[] =
    (currentFrameResponses as IWordCloudResponse[]) ?? []

  const session = useStoreSelector(
    (store) => store.event.currentEvent.liveSessionState.activeSession.data
  )

  const wordCloudStarted =
    session?.data?.framesConfig?.[frame.id]?.wordCloudStarted

  const selfResponse = responses?.find(
    (frameResponse) =>
      frameResponse.participant.enrollment.user_id === currentUser?.id
  )

  const submittedWords = selfResponse?.response?.words || []

  const handleAdd = () => {
    if (!word) {
      setError('Please enter word')

      return
    }

    if (submittedWords.includes(word)) {
      setError('You have already submitted this word')

      return
    }

    if (submittedWords.length > 0 && selfResponse) {
      onUpdateWordsInCloud({
        frameResponseId: selfResponse.id,
        words: [...submittedWords, word],
      })
      setWord('')

      return
    }

    onAddWordsInCloud({
      frameId: frame.id,
      words: [...submittedWords, word],
    })

    setWord('')
  }

  function getPlaceholder() {
    const remainingWordsCount = maxWordsCount - submittedWords.length

    if (maxWordsCount === 1) {
      return 'Say a word'
    }

    if (remainingWordsCount > 1) {
      return `Say ${remainingWordsCount} words`
    }

    if (remainingWordsCount === 1) {
      return 'Say last word'
    }

    return 'No more words to enter'
  }

  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div className="flex flex-col h-full">
        <FrameTitleDescriptionPreview
          frame={frame}
          afterTitle={
            <Chip
              variant="flat"
              size="sm"
              className="rounded-lg -translate-y-1.5 translate-x-4"
              color={wordCloudStarted ? 'success' : 'warning'}>
              {wordCloudStarted
                ? 'WordCloud is active'
                : 'Word Cloud is closed'}
            </Chip>
          }
        />

        <RenderIf isTrue={submittedWords.length !== maxWordsCount}>
          <div className="relative flex items-center bg-gray-100 rounded-full pl-6 pr-2 w-[60%] mx-auto mb-4 mt-6">
            <Input
              isDisabled={!wordCloudStarted}
              size="lg"
              value={word}
              type="text"
              placeholder={getPlaceholder()}
              classNames={{
                inputWrapper: 'rounded-xl !bg-transparent shadow-none px-0',
                base: 'max-w-[inherit] !bg-transparent',
              }}
              onChange={(e) => {
                setWord(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAdd()
                }
              }}
            />

            <Button
              size="md"
              isDisabled={!wordCloudStarted}
              color="primary"
              className="max-w-fit ml-auto rounded-full"
              onClick={handleAdd}>
              Add
            </Button>

            {error && (
              <p className="w-full text-center absolute -bottom-6 text-xs text-red-400">
                {error}
              </p>
            )}
          </div>
        </RenderIf>
        <RenderIf isTrue={!!responses?.[0]?.response?.words?.length}>
          <Responses responses={responses} frame={frame} />
        </RenderIf>
      </div>
    </SideImageLayout>
  )
}
