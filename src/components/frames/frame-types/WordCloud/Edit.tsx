import { Image } from '@heroui/react'

import { Responses } from './Responses'

import { SideImageLayout } from '@/components/common/SideImageLayout'
import { FrameText } from '@/components/event-content/FrameText'
import { FrameTextBlock } from '@/components/event-content/FrameTextBlock'
import { IFrame } from '@/types/frame.type'

export function Edit({ frame }: { frame: IFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div>
        <div>
          <FrameText key={frame.id} type="title" disableEnter />
          <FrameTextBlock blockType="paragraph" />
        </div>
        <Responses
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
      </div>
    </SideImageLayout>
  )
}
