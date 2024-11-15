import { ReactNode } from 'react'

export function FrameTitle({
  title,
  textColor,
  afterTitle,
}: {
  title: string
  textColor?: string
  afterTitle?: ReactNode
}) {
  if (title === '') return null

  return (
    <h1
      className="heading-2-bold w-full border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0"
      style={{ color: textColor }}>
      {title}
      {afterTitle}
    </h1>
  )
}
