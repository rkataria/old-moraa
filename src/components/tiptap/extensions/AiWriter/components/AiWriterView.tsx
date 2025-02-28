import { useCallback, useMemo, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import {
  NodeViewWrapper,
  NodeViewWrapperProps,
  useEditorState,
} from '@tiptap/react'
import { AiStorage, tryParseToTiptapHTML } from '@tiptap-pro/extension-ai'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'

import { AiTone, AiToneOption } from '@/components/tiptap/BlockEditor/types'
import { tones } from '@/components/tiptap/lib/constants'
import { DropdownButton } from '@/components/tiptap/ui/Dropdown'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Panel, PanelHeadline } from '@/components/tiptap/ui/Panel'
import { Textarea } from '@/components/tiptap/ui/Textarea'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'
import { Button } from '@/components/ui/Button'

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
  const [data, setData] = useState<DataProps>({
    text: '',
    tone: undefined,
    textLength: undefined,
    addHeading: false,
    language: undefined,
  })
  const currentTone = tones.find((t) => t.value === data.tone)
  const textareaId = useMemo(() => uuid(), [])

  const { generatedText } = useEditorState({
    editor,
    selector: (ctx) => {
      const aiStorage = ctx.editor.storage.ai as AiStorage

      return {
        isLoading: aiStorage.state === 'loading',
        generatedText: aiStorage.response,
        error: aiStorage.error,
      }
    },
  })

  const generateText = useCallback(async () => {
    const { language } = data

    if (!data.text) {
      toast.error('Please enter a description')

      return
    }

    editor.commands.aiTextPrompt({
      text: data.text,
      insert: false,
      tone: data.tone,
      stream: true,
      format: 'rich-text',
      language,
    })
  }, [data, editor.commands])

  const insert = useCallback(() => {
    const from = getPos()
    const to = from + node.nodeSize

    if (!generatedText) {
      toast('Nothing to add')

      return
    }

    editor
      .chain()
      .focus()
      .insertContentAt({ from, to }, generatedText.replace(/>\s+</g, '><'))
      .run()
  }, [editor, generatedText, getPos, node.nodeSize])

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
          {generatedText && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-base max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
                dangerouslySetInnerHTML={{
                  __html: tryParseToTiptapHTML(generatedText, editor) ?? '',
                }}
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
                  <Button>
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
              {generatedText && (
                <Button
                  variant="flat"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}>
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {generatedText && (
                <Button
                  variant="flat"
                  onClick={insert}
                  disabled={!generatedText}>
                  <Icon name="Check" />
                  Insert
                </Button>
              )}
              <Button
                color="primary"
                onClick={generateText}
                style={{ whiteSpace: 'nowrap' }}>
                {generatedText ? (
                  <Icon name="Repeat" />
                ) : (
                  <Icon name="Sparkles" />
                )}
                {generatedText ? 'Regenerate' : 'Generate text'}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  )
}
