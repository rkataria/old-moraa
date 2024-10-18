/* eslint-disable jsx-a11y/iframe-has-title */
type IFrameEditProps = {
  url: string
  onLoad?: () => void
}

export function IframeEdit({ url, onLoad }: IFrameEditProps) {
  return (
    <div className="w-full h-full relative">
      <iframe
        src={url}
        className="w-full h-full border-2 border-green-500 rounded-md"
        onLoad={onLoad}
      />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 p-2 bg-green-500 flex justify-center items-center rounded-bl-md rounded-br-md text-sm text-white">
        Google Slides is being edited
      </div>
    </div>
  )
}
