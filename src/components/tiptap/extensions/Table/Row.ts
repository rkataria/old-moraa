import TiptapTableRow from '@tiptap/extension-table-row'

export const TableRow = TiptapTableRow.extend({
  allowGapCursor: false,
  content: 'tableCell*',
})
// eslint-disable-next-line import/no-default-export
export default TableRow
