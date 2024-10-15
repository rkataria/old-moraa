import { Editor } from '@tiptap/core'

import API from '@/components/tiptap/lib/api'

export const handlePasteAndDropImage = (
  currentEditor: Editor,
  files: File[]
) => {
  files.forEach(async (file) => {
    const loadingNode =
      currentEditor.state.schema.nodes.imageLoadingPlaceholder.create({
        loadingPercentage: 0,
      })

    const position = currentEditor.state.selection.$anchor.pos

    currentEditor
      .chain()
      .insertContentAt(position, loadingNode.toJSON())
      .focus()
      .run()

    try {
      const imageUrl = await API.uploadImage(file, (percentage) => {
        // Update the loading percentage as the upload progresses
        const { state, view } = currentEditor
        const transaction = state.tr.setNodeMarkup(position, null, {
          loadingPercentage: percentage,
        })

        // Apply the transaction to the editor state
        view.dispatch(transaction)
      })

      currentEditor
        .chain()
        .setImageBlock({ src: imageUrl }) // Insert the image
        .deleteRange({
          from: currentEditor.state.selection.anchor - 2,
          to: currentEditor.state.selection.anchor,
        }) // Delete the loading node
        .focus()
        .run()
    } catch (error) {
      console.error('Image upload failed', error)
    }
  })
}
