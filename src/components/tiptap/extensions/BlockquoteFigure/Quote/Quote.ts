import { Node } from '@tiptap/core'

export const Quote = Node.create({
  name: 'quote',

  content: 'paragraph+',

  defining: true,

  marks: '',

  parseHTML() {
    return [
      {
        tag: 'blockquote',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', HTMLAttributes, 0]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => false,
    }
  },
})

// eslint-disable-next-line import/no-default-export
export default Quote
