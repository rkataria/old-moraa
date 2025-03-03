import { Image } from '@heroui/react'

import { Responses } from './Responses'

import { FrameTitleDescriptionPreview } from '@/components/common/FrameTitleDescriptionPreview'
import { SideImageLayout } from '@/components/common/SideImageLayout'
import { IFrame } from '@/types/frame.type'

type PreviewProps = {
  frame: IFrame
}

export function Preview({ frame }: PreviewProps) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div className="w-full h-full flex flex-col">
        <FrameTitleDescriptionPreview frame={frame} />

        <Responses
          frameId={frame.id}
          placeholder={
            <div className="relative w-full h-auto grid gap-20 place-items-center m-auto max-w-fit">
              <Image src="/images/reflection/preview.svg" width={518} />
              <div className="text-center grid gap-4">
                <p className="text-2xl font-medium w-full">
                  Reflection yet to start
                </p>
                <p className="text-sm text-gray-600">
                  No responses found. Once they happen, people’s responses will
                  appear here.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </SideImageLayout>
  )
}
