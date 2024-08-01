/* eslint-disable no-unused-expressions */
import { Icon8Content } from './Icon8Content'
import { LibraryContent } from './LibraryContent'
import { UnsplashContent } from './UnsplashContent'

export enum MediaProviderType {
  LIBRARY = 'Library',
  UNSPLASH = 'Unsplash',
  ICON8 = 'Icon8',
}

export function MediaProviderContent({
  provider,
  fileType,
  onSelectCallback,
}: {
  provider: MediaProviderType
  fileType?: 'images' | 'videos'
  onSelectCallback?: (imageElment: HTMLImageElement) => void
}) {
  console.log('fileType', fileType)

  const onSelect = (imageElment: HTMLImageElement) => {
    onSelectCallback && onSelectCallback(imageElment)
  }

  const renderersByMediaProvider: Record<MediaProviderType, React.ReactNode> = {
    [MediaProviderType.LIBRARY]: <LibraryContent />,
    [MediaProviderType.UNSPLASH]: <UnsplashContent onSelect={onSelect} />,
    [MediaProviderType.ICON8]: <Icon8Content />,
  }

  const renderer = renderersByMediaProvider[provider]

  return (
    <div className="w-full h-full overflow-hidden overflow-y-auto scrollbar-none">
      {renderer}
    </div>
  )
}
