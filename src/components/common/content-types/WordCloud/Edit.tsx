import { useEffect, useState } from 'react'

import { Image } from '@nextui-org/react'

import { Responses } from './Responses'

import { FrameText } from '@/components/event-content/FrameText'
import { FrameTextBlock } from '@/components/event-content/FrameTextBlock'
import { IFrame } from '@/types/frame.type'

export function Edit({ frame }: { frame: IFrame }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    setTimeout(() => {
      setAnimate(false)
    }, 2000)
  }, [])

  return (
    <>
      <div>
        <FrameText key={frame.id} type="title" disableEnter />
        <FrameTextBlock blockType="paragraph" />
      </div>
      <Responses
        animate={animate}
        frame={frame}
        placeholder={
          <div className="flex flex-col h-full">
            <Image
              src="/images/word-cloud/edit.svg"
              classNames={{ wrapper: 'm-auto', img: 'w-[500px]' }}
            />
          </div>
        }
      />
    </>
  )
}
