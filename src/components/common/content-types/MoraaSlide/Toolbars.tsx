import { useContext } from 'react'

import { fabric } from 'fabric'
import { IoImageOutline } from 'react-icons/io5'

import { HistoryControls } from './HistoryControls'
import { ListBox } from './ListBox'
import { ShapesControls } from './ShapesControls'
import { TextBox } from './TextBox'

import { FileUploader } from '@/components/event-content/FileUploader'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'

export function Toolbars() {
  const { currentFrame } = useContext(EventContext) as EventContextType
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

  if (!canvas) return null

  const renderControls = () => (
    <>
      <TextBox />
      <ListBox />
      <FileUploader
        onFilesUploaded={(urls) => {
          const url = urls?.[0]?.signedUrl

          if (!url) return

          fabric.Image.fromURL(url, (img) => {
            img.set({
              left: 100,
              top: 100,
            })
            img.scaleToWidth(100)
            img.set('centeredRotation', true)
            canvas?.add(img)
            canvas.setActiveObject(img)
          })
        }}
        triggerProps={{
          variant: 'light',
          size: 'lg',
          radius: 'md',
          className:
            'flex-none flex flex-col justify-center items-center gap-1',
          isIconOnly: true,
          children: (
            <>
              <IoImageOutline size={18} />
              <span className="text-xs mt-1">Media</span>
            </>
          ),
        }}
      />

      <ShapesControls />
      <HistoryControls />
    </>
  )

  if (!canvas) return null

  return (
    <div className="rounded-sm flex justify-center items-center gap-2 max-w-full overflow-auto scrollbar-nono m-auto w-fit">
      {renderControls()}
    </div>
  )
}
