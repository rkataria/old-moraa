// TODO: Fix any types
/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic'
import { TbSettings } from 'react-icons/tb'

import { Button } from '@nextui-org/react'

import { CoverEditor } from './content-types/CoverEditor'
import { TextImageEditor } from './content-types/TextImageEditor'
import { ContentType } from './ContentTypePicker'
import { GoogleSlidesImportEditor } from './GoogleSlideImportEditor'
import { GoogleSlidesEditor } from './GoogleSlidesEditor'
import { PollEditor } from './PollEditor'
import { ReflectionEditor } from './ReflectionEditor'
import { VideoEmbedEditor } from './VideoEmbedEditor'
import { ImageViewer } from '../common/ImageViewer'

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
  return (
    <div
      style={{ backgroundColor: slide.config.backgroundColor }}
      className={cn('relative group w-full h-full p-4', {
        'pointer-events-none': !isOwner,
      })}>
      <div
        className={cn('relative left-0 w-full', {
          hidden: !isOwner,
        })}
      />
      {settingsEnabled && (
        <Button
          isIconOnly
          variant="light"
          className="absolute top-2 right-2 z-10 pointer-events-auto bg-black/20 text-white"
          onClick={() => setSettingsSidebarVisible(true)}>
          <TbSettings size={22} />
        </Button>
      )}
      <div
        data-slide-id={slide.id}
        className="relative w-full h-full rounded-md overflow-auto transition-all">
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
      </div>
    </div>
  )
}
