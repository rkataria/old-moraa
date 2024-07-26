import { Document as TiptapDocument } from '@tiptap/extension-document'

export const Document = TiptapDocument.extend({
  content: '(block|columns)+',
})

// eslint-disable-next-line import/no-default-export
export default Document
