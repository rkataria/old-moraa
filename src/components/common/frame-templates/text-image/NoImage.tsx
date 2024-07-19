import { ImageBehind, ImageBehindProps } from './ImageBehind'

export function NoImage({ ...props }) {
  if (!props.frame) return null

  return <ImageBehind {...(props as ImageBehindProps)} showImage={false} />
}
