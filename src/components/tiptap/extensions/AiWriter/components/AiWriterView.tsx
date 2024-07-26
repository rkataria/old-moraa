import { useCallback, useMemo, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { Extension, NodeViewWrapper, NodeViewWrapperProps } from '@tiptap/react'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'

import { AiTone, AiToneOption } from '@/components/tiptap/BlockEditor/types'
import { tones } from '@/components/tiptap/lib/constants'
import { Button } from '@/components/tiptap/ui/Button'
import { DropdownButton } from '@/components/tiptap/ui/Dropdown'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Loader } from '@/components/tiptap/ui/Loader'
import { Panel, PanelHeadline } from '@/components/tiptap/ui/Panel'
import { Textarea } from '@/components/tiptap/ui/Textarea'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'

export interface DataProps {
  text: string
  addHeading: boolean
  tone?: AiTone
  textUnit?: string
  textLength?: string
  language?: string
}

export function AiWriterView({
  editor,
  node,
  getPos,
  deleteNode,
}: NodeViewWrapperProps) {
  const aiOptions = editor.extensionManager.extensions.find(
    (ext: Extension) => ext.name === 'ai'
  ).options

  const [data, setData] = useState<DataProps>({
    text: '',
    tone: undefined,
    textLength: undefined,
    addHeading: false,
    language: undefined,
  })
  const currentTone = tones.find((t) => t.value === data.tone)
  const [previewText, setPreviewText] = useState(undefined)
  const [isFetching, setIsFetching] = useState(false)
  const textareaId = useMemo(() => uuid(), [])

  const generateText = useCallback(async () => {
    const {
      text: dataText,
      tone,
      textLength,
      textUnit,
      addHeading,
      language,
    } = data

    if (!data.text) {
      toast.error('Please enter a description')

      return
    }

    setIsFetching(true)

    const payload = {
      text: dataText,
      textLength,
      textUnit,
      useHeading: addHeading,
      tone,
      language,
    }

    try {
      const { baseUrl, appId, token } = aiOptions
      const response = await fetch(`${baseUrl}/text/prompt`, {
        method: 'POST',
        headers: {
          accept: 'application.json',
          'Content-Type': 'application/json',
          'X-App-Id': appId.trim(),
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify(payload),
      })

      const json = await response.json()
      const text = json.response

      if (!text.length) {
        setIsFetching(false)

        return
      }

      setPreviewText(text)

      setIsFetching(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (errPayload: any) {
      const errorMessage = errPayload?.response?.data?.error
      const message =
        errorMessage !== 'An error occurred'
          ? `An error has occured: ${errorMessage}`
          : errorMessage

      setIsFetching(false)
      toast.error(message)
    }
  }, [data, aiOptions])

  const insert = useCallback(() => {
    const from = getPos()
    const to = from + node.nodeSize

    editor.chain().focus().insertContentAt({ from, to }, previewText).run()
  }, [editor, previewText, getPos, node.nodeSize])

  const discard = useCallback(() => {
    deleteNode()
  }, [deleteNode])

  const onTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setData((prevData) => ({ ...prevData, text: e.target.value }))
    },
    []
  )

  const onUndoClick = useCallback(() => {
    setData((prevData) => ({ ...prevData, tone: undefined }))
  }, [])

  const createItemClickHandler = useCallback(
    (tone: AiToneOption) => () => {
      setData((prevData) => ({ ...prevData, tone: tone.value }))
    },
    []
  )

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          {isFetching && <Loader label="AI is now doing its job!" />}
          {previewText && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-base max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
                dangerouslySetInnerHTML={{ __html: previewText }}
              />
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={onTextAreaChange}
            placeholder="Tell me what you want me to write about."
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex justify-between w-auto gap-1">
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button variant="tertiary">
                    <Icon name="Mic" />
                    {currentTone?.label || 'Change tone'}
                    <Icon name="ChevronDown" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {() => (
                    <div className="min-w-[12rem]">
                      {!!data.tone && (
                        <>
                          <DropdownButton
                            isActive={data.tone === undefined}
                            onClick={onUndoClick}>
                            <Icon name="Undo2" />
                            Reset
                          </DropdownButton>
                          <Toolbar.Divider horizontal />
                        </>
                      )}
                      {tones.map((tone) => (
                        <DropdownButton
                          isActive={tone.value === data.tone}
                          onClick={createItemClickHandler(tone)}>
                          {tone.label}
                        </DropdownButton>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between w-auto gap-1">
              {previewText && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}>
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {previewText && (
                <Button
                  variant="ghost"
                  onClick={insert}
                  disabled={!previewText}>
                  <Icon name="Check" />
                  Insert
                </Button>
              )}
              <Button
                variant="primary"
                onClick={generateText}
                style={{ whiteSpace: 'nowrap' }}>
                {previewText ? (
                  <Icon name="Repeat" />
                ) : (
                  <Icon name="Sparkles" />
                )}
                {previewText ? 'Regenerate' : 'Generate text'}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  )
}
