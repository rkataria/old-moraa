import { memo } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { BubbleMenu, Editor } from '@tiptap/react'

import { AIDropdown } from './components/AIDropdown'
import { ContentTypePicker } from './components/ContentTypePicker'
import { EditLinkPopover } from './components/EditLinkPopover'
import { FontFamilyPicker } from './components/FontFamilyPicker'
import { FontSizePicker } from './components/FontSizePicker'
import { useTextmenuCommands } from './hooks/useTextmenuCommands'
import { useTextmenuContentTypes } from './hooks/useTextmenuContentTypes'
import { useTextmenuStates } from './hooks/useTextmenuStates'

import { ColorPicker } from '@/components/common/ColorPicker'
import { Icon } from '@/components/tiptap/ui/Icon'
import { Toolbar } from '@/components/tiptap/ui/Toolbar'

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(Toolbar.Button)
const MemoColorPicker = memo(ColorPicker)
const MemoFontFamilyPicker = memo(FontFamilyPicker)
const MemoFontSizePicker = memo(FontSizePicker)
const MemoContentTypePicker = memo(ContentTypePicker)

export type TextMenuProps = {
  editor: Editor
}

export function TextMenu({ editor }: TextMenuProps) {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: { placement: 'top-start' },
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}>
      <Toolbar.Wrapper>
        <AIDropdown
          onCompleteSentence={commands.onCompleteSentence}
          onEmojify={commands.onEmojify}
          onFixSpelling={commands.onFixSpelling}
          onMakeLonger={commands.onMakeLonger}
          onMakeShorter={commands.onMakeShorter}
          onSimplify={commands.onSimplify}
          onTldr={commands.onTldr}
          onTone={commands.onTone}
          onTranslate={commands.onTranslate as (l: string) => void}
        />
        <Toolbar.Divider />
        <MemoContentTypePicker options={blockOptions} />
        <MemoFontFamilyPicker
          onChange={commands.onSetFont}
          value={states.currentFont || ''}
        />
        <MemoFontSizePicker
          onChange={commands.onSetFontSize}
          value={states.currentSize || ''}
        />
        <Toolbar.Divider />
        <MemoButton
          tooltip="Bold"
          tooltipShortcut={['Mod', 'B']}
          onClick={commands.onBold}
          active={states.isBold}>
          <Icon name="Bold" />
        </MemoButton>
        <MemoButton
          tooltip="Italic"
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}>
          <Icon name="Italic" />
        </MemoButton>
        <MemoButton
          tooltip="Underline"
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}>
          <Icon name="Underline" />
        </MemoButton>
        <MemoButton
          tooltip="Strikehrough"
          tooltipShortcut={['Mod', 'Shift', 'S']}
          onClick={commands.onStrike}
          active={states.isStrike}>
          <Icon name="Strikethrough" />
        </MemoButton>
        <MemoButton
          tooltip="Code"
          tooltipShortcut={['Mod', 'E']}
          onClick={commands.onCode}
          active={states.isCode}>
          <Icon name="Code" />
        </MemoButton>
        <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
          <Icon name="CodeXml" />
        </MemoButton>
        <EditLinkPopover onSetLink={commands.onLink} />
        <MemoColorPicker
          trigger={
            <MemoButton
              active={!!states.currentHighlight}
              tooltip="Highlight text">
              <Icon name="Highlighter" />
            </MemoButton>
          }
          defaultColor={states.currentHighlight}
          onChange={commands.onChangeHighlight}
        />
        <MemoColorPicker
          trigger={
            <MemoButton active={!!states.currentColor} tooltip="Text color">
              <Icon name="Palette" />
            </MemoButton>
          }
          defaultColor={states.currentColor}
          onChange={commands.onChangeColor}
        />
        <Popover placement="bottom">
          <PopoverTrigger>
            <MemoButton tooltip="More options">
              <Icon name="EllipsisVertical" />
            </MemoButton>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            {() => (
              <Toolbar.Wrapper>
                <MemoButton
                  tooltip="Subscript"
                  tooltipShortcut={['Mod', '.']}
                  onClick={commands.onSubscript}
                  active={states.isSubscript}>
                  <Icon name="Subscript" />
                </MemoButton>
                <MemoButton
                  tooltip="Superscript"
                  tooltipShortcut={['Mod', ',']}
                  onClick={commands.onSuperscript}
                  active={states.isSuperscript}>
                  <Icon name="Superscript" />
                </MemoButton>
                <Toolbar.Divider />
                <MemoButton
                  tooltip="Align left"
                  tooltipShortcut={['Shift', 'Mod', 'L']}
                  onClick={commands.onAlignLeft}
                  active={states.isAlignLeft}>
                  <Icon name="AlignLeft" />
                </MemoButton>
                <MemoButton
                  tooltip="Align center"
                  tooltipShortcut={['Shift', 'Mod', 'E']}
                  onClick={commands.onAlignCenter}
                  active={states.isAlignCenter}>
                  <Icon name="AlignCenter" />
                </MemoButton>
                <MemoButton
                  tooltip="Align right"
                  tooltipShortcut={['Shift', 'Mod', 'R']}
                  onClick={commands.onAlignRight}
                  active={states.isAlignRight}>
                  <Icon name="AlignRight" />
                </MemoButton>
                <MemoButton
                  tooltip="Justify"
                  tooltipShortcut={['Shift', 'Mod', 'J']}
                  onClick={commands.onAlignJustify}
                  active={states.isAlignJustify}>
                  <Icon name="AlignJustify" />
                </MemoButton>
              </Toolbar.Wrapper>
            )}
          </PopoverContent>
        </Popover>
      </Toolbar.Wrapper>
    </BubbleMenu>
  )
}
