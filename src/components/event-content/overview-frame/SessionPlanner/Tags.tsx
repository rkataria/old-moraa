import { KeyboardEvent, useContext, useState } from 'react'

import {
  Button,
  Chip,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'
import { AiOutlineClose } from 'react-icons/ai'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

export function Tags({
  frameId,
  config,
}: {
  frameId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')

  const [tag, setTag] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const { updateFrame, preview } = useContext(EventContext) as EventContextType

  const frameTags = (config.tags || []) as string[]

  const removeTag = (tagFromRemove: string) => {
    let updatdTags = [...tags]
    updatdTags = updatdTags.filter((t) => t !== tagFromRemove)
    setTags(updatdTags)
  }

  const resetInput = () => {
    setError('')
    setTag('')
  }

  const handleAddTag = () => {
    if (tag.length === 0 && tags.length === 0) {
      setError('Please write a tag')

      return
    }

    if (isDuplicate()) {
      setError('Duplicated tag')

      return
    }

    const newTags = [...frameTags, ...tags]
    updateFrame({
      frameId,
      framePayload: {
        config: {
          ...config,
          tags: tag ? [...newTags, tag] : newTags,
        },
      },
    })

    resetInput()
    setTags([])
    setIsOpen(false)
  }

  const addTag = () => {
    const updatdTags = [...tags]
    updatdTags.push(tag)
    setTags(updatdTags)
    resetInput()
  }

  const isDuplicate = () =>
    tags.some((t) => t === tag) || frameTags.some((t) => t === tag)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!tag) {
        setError('Please write a tag')

        return
      }

      if (isDuplicate()) {
        setError('Duplicate Tag')

        return
      }

      addTag()
    }
  }

  const deleteTag = (tagFromFrame: string) => {
    updateFrame({
      frameId,
      framePayload: {
        config: {
          ...config,
          tags: frameTags.filter((t) => t !== tagFromFrame),
        },
      },
    })
  }

  const ifFramehasTags = frameTags.length !== 0

  return (
    <div className="relative p-2 border-x-2 group/frame_tags ">
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <Button
            isDisabled={preview}
            isIconOnly={ifFramehasTags}
            variant="light"
            className={cn('z-[100] text-primary/80', {
              'absolute bottom-0 right-0 w-6 h-6 min-w-6 m-1 opacity-0 group-hover/frame_tags:opacity-100 border-1':
                ifFramehasTags,
              'w-full h-full': !ifFramehasTags,
            })}>
            {ifFramehasTags ? '+' : '+ Add Tags'}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <Input
              value={tag}
              placeholder="Write a tag"
              onChange={(e) => setTag(e.target.value)}
              endContent={
                <Button
                  onClick={handleAddTag}
                  className="-mr-3"
                  color="primary"
                  variant="solid">
                  + Add
                </Button>
              }
              onKeyDown={handleKeyDown}
              errorMessage={error}
              isInvalid={!!error}
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((addedTag) => (
                <Chip onClose={() => removeTag(addedTag)} variant="bordered">
                  {addedTag}
                </Chip>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex gap-1 flex-wrap max-h-[106px] overflow-y-scroll scrollbar-none">
        {frameTags?.map((frameTag) => (
          <Chip
            onClose={() => deleteTag(frameTag)}
            size="sm"
            classNames={{
              base: 'bg-primary/10 rounded-md gap-2',
              content: 'text-primary',
            }}
            endContent={!preview ? <AiOutlineClose size={10} /> : <p />}>
            {frameTag}
          </Chip>
        ))}
      </div>
    </div>
  )
}
