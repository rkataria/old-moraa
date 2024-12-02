import React, { useContext } from 'react'

import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
} from '@giphy/react-components'

function Components({
  onImageSelect,
}: {
  onImageSelect: (ele: HTMLImageElement) => void
}) {
  const { fetchGifs, searchKey } = useContext(SearchContext)

  return (
    <div className="w-full">
      <SearchBar className="mb-4" />
      <Grid
        key={searchKey}
        columns={3}
        width={480}
        fetchGifs={fetchGifs}
        onGifClick={(gif, e) => {
          const imageEle = document.createElement('img')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          imageEle.src = (e.target as any).src
          onImageSelect(imageEle)
          e.preventDefault()
          e.stopPropagation()
        }}
      />
    </div>
  )
}

export function GiphyContent({
  onImageSelect,
}: {
  onImageSelect: (ele: HTMLImageElement) => void
}) {
  return (
    <SearchContextManager
      shouldDefaultToTrending
      apiKey={import.meta.env.VITE_GIPHY_API_KEY}
      options={{
        type: 'stickers',
      }}>
      <Components onImageSelect={onImageSelect} />
    </SearchContextManager>
  )
}
