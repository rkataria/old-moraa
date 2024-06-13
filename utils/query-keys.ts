class QueryKeysGenerator<FilterKeys extends string[] = ['']> {
  identifier: string

  constructor(identifier: string) {
    this.identifier = identifier
  }

  all() {
    return [this.identifier]
  }
  listings() {
    return [...this.all(), 'LISTING']
  }

  listing(filters?: { [x in FilterKeys[number]]?: string | number }) {
    if (filters && Object.values(filters).some((v) => v !== undefined)) {
      return [...this.listings(), filters]
    }

    return this.listings()
  }
  items() {
    return [...this.all(), 'ITEM']
  }
  item(id: string) {
    return [...this.items(), id]
  }
}

export const QueryKeys = Object.freeze({
  DownloadPDF: new QueryKeysGenerator('DOWNLOAD_PDF'),
  GetFrameNotes: new QueryKeysGenerator<['frameId']>('GET_FRAME_NOTES'),
})
