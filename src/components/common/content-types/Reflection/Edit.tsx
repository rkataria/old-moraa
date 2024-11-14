import { Image } from '@nextui-org/react'

import { PreviewCard } from './PreviewCard'
import { Responses } from './Responses'

import { FrameTitleDescriptionPanel } from '@/components/event-content/FrameTitleDescriptionPanel'
import { IFrame } from '@/types/frame.type'

interface EditProps {
  frame: IFrame
}

export function Edit({ frame }: EditProps) {
  return (
    <div className="w-full h-full flex flex-col gap-20">
      <FrameTitleDescriptionPanel key={frame.id} />

      <Responses
        frameId={frame.id}
        placeholder={
          <div className="relative w-full h-auto flex items-center gap-10 m-auto max-w-fit">
            <PreviewCard
              username="Participant"
              reflection="All answers will show in a nice and dynamic grid. Like these ones"
              reactions={[
                {
                  id: '',
                  reaction: 'fire',
                  frame_response_id: '',
                  participant_id: '',
                },
              ]}
              className="w-[323px] h-fit absolute top-[-38px] left-[-100px] z-[100] shadow-xl"
            />
            <Image src="/images/reflection/edit.svg" width={518} />
          </div>
        }
      />
    </div>
  )
}
