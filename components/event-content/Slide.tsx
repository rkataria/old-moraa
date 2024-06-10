// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext } from 'react'

import dynamic from 'next/dynamic'
import { TbSettings } from 'react-icons/tb'

import { Button } from '@nextui-org/react'

import { CoverEditor } from './content-types/CoverEditor'
import { MoraaBoardEditor } from './content-types/MoraaBoardEditor'
import { RichTextEditor } from './content-types/RichTextEditor'
import { TextImageEditor } from './content-types/TextImageEditor'
import { GoogleSlidesImportEditor } from './GoogleSlideImportEditor'
import { GoogleSlidesEditor } from './GoogleSlidesEditor'
import { MiroEmbedEditor } from './MiroEmbedEditor'
import { PollEditor } from './PollEditor'
import { ReflectionEditor } from './ReflectionEditor'
import { SlideTitleDescriptionPanel } from './SlideTitleDescriptionPanel'
import { VideoEmbedEditor } from './VideoEmbedEditor'
import { Canvas } from '../common/content-types/Canvas'
import { SlidePreview } from '../common/SlidePreview'

import { ImageViewer } from '@/components/common/content-types/ImageViewer'
import { ContentType } from '@/components/common/ContentTypePicker'
import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { ISlide } from '@/types/slide.type'
import { cn, getOjectPublicUrl } from '@/utils/utils'

const PDFUploader = dynamic(
  () => import('./PDFUploader').then((mod) => mod.PDFUploader),
  {
    ssr: false,
  }
)

interface SlideProps {
  isOwner: boolean
  slide: ISlide
  settingsEnabled?: boolean
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function Slide({
  isOwner = false,
  slide,
  settingsEnabled,
  setSettingsSidebarVisible,
}: SlideProps) {
  const { preview, currentSlide } = useContext(EventContext) as EventContextType

  if (preview || !isOwner) {
    return <SlidePreview slide={slide} />
  }

  if (!currentSlide) return null

  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className={cn('relative group w-full h-full p-4 bg-gray-100', {
        'pointer-events-none': !isOwner,
      })}>
      <div
        className={cn('relative left-0 w-full', {
          hidden: !isOwner,
        })}
      />
      {settingsEnabled && !preview && (
        <Button
          isIconOnly
          variant="light"
          className="absolute top-12 right-0 z-10 pointer-events-auto bg-gray-900 text-white hover:bg-black rounded-r-none transition-all duration-200 ease-in-out group/slide-settings"
          onClick={() => setSettingsSidebarVisible((o) => !o)}>
          <TbSettings
            size={22}
            className="rotate-0 group-hover/slide-settings:rotate-45 transition-all duration-200 ease-in-out"
          />
        </Button>
      )}
      <div
        data-slide-id={slide.id}
        className="relative flex flex-col w-full h-full rounded-md overflow-auto transition-all">
        <SlideTitleDescriptionPanel key={slide.id} />
        {slide.type === ContentType.CANVAS && <Canvas slide={slide as any} />}
        {slide.type === ContentType.POLL && (
          <PollEditor slide={slide} openSettings={false} />
        )}
        {slide.type === ContentType.COVER && <CoverEditor />}
        {slide.type === ContentType.GOOGLE_SLIDES && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <GoogleSlidesEditor slide={slide as any} />
        )}
        {slide.type === ContentType.GOOGLE_SLIDES_IMPORT && (
          <GoogleSlidesImportEditor slide={slide} />
        )}
        {slide.type === ContentType.REFLECTION && (
          <ReflectionEditor slide={slide} />
        )}
        {slide.type === ContentType.PDF_VIEWER && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <PDFUploader slide={slide as any} />
        )}
        {slide.type === ContentType.VIDEO_EMBED && (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <VideoEmbedEditor slide={slide as any} />
        )}
        {slide.type === ContentType.IMAGE_VIEWER && (
          <ImageViewer src={getOjectPublicUrl(slide.content?.path as string)} />
        )}
        {slide.type === ContentType.TEXT_IMAGE && <TextImageEditor />}
        {slide.type === ContentType.MIRO_EMBED && (
          <MiroEmbedEditor slide={slide as any} />
        )}
        {slide.type === ContentType.RICH_TEXT && <RichTextEditor />}
        {slide.type === ContentType.MORAA_BOARD && (
          <MoraaBoardEditor slide={slide} />
        )}
      </div>
    </div>
  )
}
