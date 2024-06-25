import { useContext } from 'react'

import { BsSliders } from 'react-icons/bs'

import { CommonConfiguration } from './CommonConfiguration'
import { ConfigurationHeader } from './ConfigurationHeader'
import { MoraaBoardConfiguration } from './MoraaBoardConfiguration'
import { PdfConfiguration } from './PdfConfiguration'
import { PollConfiguration } from './PollConfiguration'
import { ReflectionConfiguration } from './ReflectionConfiguration'

import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'

export function FrameConfiguration() {
  const { currentFrame } = useContext(EventContext) as EventContextType

  if (!currentFrame) return null

  const renderersByContentType: Record<ContentType, React.ReactNode> = {
    [ContentType.VIDEO]: null,
    [ContentType.GOOGLE_SLIDES_IMPORT]: null,
    [ContentType.COVER]: null,
    [ContentType.POLL]: <PollConfiguration key={currentFrame.id} />,
    [ContentType.GOOGLE_SLIDES]: null,
    [ContentType.PDF_VIEWER]: <PdfConfiguration key={currentFrame.id} />,
    [ContentType.REFLECTION]: <ReflectionConfiguration key={currentFrame.id} />,
    [ContentType.VIDEO_EMBED]: null,
    [ContentType.TEXT_IMAGE]: null,
    [ContentType.IMAGE_VIEWER]: null,
    [ContentType.RICH_TEXT]: null,
    [ContentType.MIRO_EMBED]: null,
    [ContentType.MORAA_BOARD]: (
      <MoraaBoardConfiguration key={currentFrame.id} />
    ),
    [ContentType.CANVAS]: null,
    [ContentType.BREAKOUT]: null,
  }

  const renderer = renderersByContentType[currentFrame.type]

  return (
    <div className="p-4 text-sm">
      <ConfigurationHeader icon={<BsSliders />} title="Configuration" />
      <div className="pt-8 flex flex-col gap-4">
        <CommonConfiguration />
        {renderer}
      </div>
    </div>
  )
}
