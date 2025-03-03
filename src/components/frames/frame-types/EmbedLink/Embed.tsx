/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/no-danger */
type EmbedProps = {
  html?: string
  canonical?: string
}

export function Embed({ html, canonical }: EmbedProps) {
  if (html) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="w-full h-full"
      />
    )
  }

  if (canonical) {
    return <iframe src={canonical} width="100%" height="100%" />
  }

  return null
}
