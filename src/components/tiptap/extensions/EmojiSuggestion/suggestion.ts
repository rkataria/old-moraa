// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Editor } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
// eslint-disable-next-line import/no-extraneous-dependencies
import tippy, { Instance } from 'tippy.js'

import EmojiList from './components/EmojiList'

export const emojiSuggestion = {
  items: ({ editor, query }: { editor: Editor; query: string }) =>
    editor.storage.emoji.emojis
      .filter(
        ({ shortcodes, tags }: { shortcodes: string[]; tags: string[] }) =>
          shortcodes.find((shortcode) =>
            shortcode.startsWith(query.toLowerCase())
          ) || tags.find((tag) => tag.startsWith(query.toLowerCase()))
      )
      .slice(0, 250),

  allowSpaces: false,

  render: () => {
    let component: ReactRenderer
    let popup: Instance

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onUpdate(props: SuggestionProps<any>) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          component.destroy()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
// eslint-disable-next-line import/no-default-export
export default emojiSuggestion
