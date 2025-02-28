import { Image } from '@heroui/react'

import { Responses } from './Responses'
import { FrameTitleDescriptionPreview } from '../../FrameTitleDescriptionPreview'
import { SideImageLayout } from '../../SideImageLayout'

import { IFrame } from '@/types/frame.type'

export function Preview({ frame }: { frame: IFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <div className="w-full h-full flex flex-col gap-4">
        <FrameTitleDescriptionPreview frame={frame} />

        <Responses
          frame={frame}
          placeholder={
            <div className="relative w-full h-auto grid gap-20 place-items-center m-auto max-w-fit">
              <Image
                src="/images/word-cloud/preview.svg"
                classNames={{ wrapper: 'm-auto', img: 'w-[500px]' }}
              />
              <div className="text-center grid gap-4">
                <p className="text-2xl font-medium w-full">
                  Word Cloud Yet to Start
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
