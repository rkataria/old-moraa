import { useCallback } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'

import { languages, tones } from '@/components/tiptap/lib/constants'
import { DropdownButton } from '@/components/tiptap/ui/Dropdown'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Surface } from '@/components/tiptap/ui/Surface'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'

export type AIDropdownProps = {
  onSimplify: () => void
  onFixSpelling: () => void
  onMakeShorter: () => void
  onMakeLonger: () => void
  onEmojify: () => void
  onTldr: () => void
  onTranslate: (language: string) => void
  onTone: (tone: string) => void
  onCompleteSentence: () => void
}

export function AIDropdown({
  onCompleteSentence,
  onEmojify,
  onFixSpelling,
  onMakeLonger,
  onMakeShorter,
  onSimplify,
  onTldr,
  onTone,
  onTranslate,
}: AIDropdownProps) {
  const handleTone = useCallback((tone: string) => () => onTone(tone), [onTone])
  const handleTranslate = useCallback(
    (language: string) => () => onTranslate(language),
    [onTranslate]
  )

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Toolbar.Button
          className="text-purple-500 hover:text-purple-600 active:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 dark:active:text-purple-400"
          activeClassname="text-purple-600 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-200">
          <Icon name="Sparkles" className="mr-1" />
          AI Tools
          <Icon name="ChevronDown" className="w-2 h-2 ml-1" />
        </Toolbar.Button>
      </PopoverTrigger>
      <PopoverContent>
        {() => (
          <div className="min-w-[10rem]">
            <DropdownButton onClick={onSimplify}>
              <Icon name="CircleSlash" />
              Simplify
            </DropdownButton>
            <DropdownButton onClick={onFixSpelling}>
              <Icon name="Eraser" />
              Fix spelling & grammar
            </DropdownButton>
            <DropdownButton onClick={onMakeShorter}>
              <Icon name="ArrowLeftToLine" />
              Make shorter
            </DropdownButton>
            <DropdownButton onClick={onMakeLonger}>
              <Icon name="ArrowRightToLine" />
              Make longer
            </DropdownButton>
            <div className="relative group/changeTone">
              <DropdownButton>
                <Icon name="Mic" />
                Change tone
                <Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
              </DropdownButton>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto absolute left-[100%] top-0 opacity-0 group-hover/changeTone:opacity-100 ">
                {tones.map((tone) => (
                  <DropdownButton
                    onClick={handleTone(tone.value)}
                    key={tone.value}>
                    {tone.label}
                  </DropdownButton>
                ))}
              </Surface>
            </div>

            <DropdownButton onClick={onTldr}>
              <Icon name="Ellipsis" />
              Tl;dr:
            </DropdownButton>
            <DropdownButton onClick={onEmojify}>
              <Icon name="SmilePlus" />
              Emojify
            </DropdownButton>
            <div className="relative group/translate">
              <DropdownButton>
                <Icon name="Languages" />
                Translate
                <Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
              </DropdownButton>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto absolute left-[100%] top-0 opacity-0 group-hover/translate:opacity-100">
                {languages.map((lang) => (
                  <DropdownButton
                    onClick={handleTranslate(lang.value)}
                    key={lang.value}>
                    {lang.label}
                  </DropdownButton>
                ))}
              </Surface>
            </div>

            <DropdownButton onClick={onCompleteSentence}>
              <Icon name="PenLine" />
              Complete sentence
            </DropdownButton>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
