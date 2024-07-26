import { mergeAttributes } from '@tiptap/core'
import TiptapHorizontalRule from '@tiptap/extension-horizontal-rule'

export const HorizontalRule = TiptapHorizontalRule.extend({
  renderHTML() {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }),
      ['hr'],
    ]
  },
})
// eslint-disable-next-line import/no-default-export
export default HorizontalRule
