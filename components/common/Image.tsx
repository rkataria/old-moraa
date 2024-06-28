import { useEffect, useState } from 'react'

import { Image as NextUiImage, ImageProps } from '@nextui-org/react'

import { IMAGE_PLACEHOLDER } from '@/constants/common'

export function Image({
  url,
  imageProps,
}: {
  url: string
  imageProps: ImageProps
}) {
  const [img, setImg] = useState(url)

  useEffect(() => {
    if (url) {
      setImg(url)

      return
    }
    setImg(IMAGE_PLACEHOLDER)
  }, [url])

  return (
    <NextUiImage
      src={img}
      fallbackSrc={IMAGE_PLACEHOLDER}
      {...imageProps}
      onError={() => {
        setImg(IMAGE_PLACEHOLDER)
      }}
    />
  )
}
