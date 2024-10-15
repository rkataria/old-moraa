import { Node } from '@tiptap/core'

export const ImageLoadingPlaceholder = Node.create({
  name: 'imageLoadingPlaceholder',

  group: 'inline',

  inline: true,

  // Define the node schema
  addAttributes() {
    return {
      loadingPercentage: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-placeholder="loading"]' }]
  },

  renderHTML({ node }) {
    return [
      'span',
      {
        'data-placeholder': 'loading',
        style:
          'width: 100%; display:flex; border: 1px dashed black; text-align: center; padding: 14px; justify-content:center; border-radius:4px',
      },
      `${node.attrs.loadingPercentage}%`,
    ]
  },
})
