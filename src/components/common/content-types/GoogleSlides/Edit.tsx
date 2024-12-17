/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/iframe-has-title */

import { useState } from 'react'

import { SiGoogleslides } from 'react-icons/si'
import * as yup from 'yup'

import { EmbedEdit } from './EmbedEdit'
import { IframeEdit } from './IframeEdit'
import { ImportEdit } from './ImportEdit'

import { useFlags } from '@/flags/client'
import { type GoogleSlidesFrame } from '@/types/frame-picker.type'
import { cn } from '@/utils/utils'

const googleSlidesEmbedSchema = yup.object({
  googleSlideUrl: yup
    .string()
    .label('Google Slide Url')
    .required('Please give slides url'),
  startPosition: yup.number().label('Presentation start position'),
  endPosition: yup.number(),
  importAsIndividualFrames: yup.boolean(),
})

export type GoogleSlideEmbedFormData = yup.InferType<
  typeof googleSlidesEmbedSchema
>

type EditProps = {
  frame: GoogleSlidesFrame
}

export function Edit({ frame }: EditProps) {
  const [mode, setMode] = useState<'import' | 'embed' | null>(null)
  const { flags } = useFlags()

  // If frame has googleSlideUrl, allow to edit google slides content
  if (frame.content?.googleSlideUrl) {
    return <IframeEdit url={frame.content?.googleSlideUrl} />
  }

  if (mode === 'embed' || !flags?.import_google_slides) {
    return (
      <EmbedEdit
        frame={frame}
        onChangeMode={() => setMode('import')}
        hideImportLink={!flags?.import_google_slides}
      />
    )
  }

  if (mode === 'import') {
    return <ImportEdit frame={frame} onChangeMode={() => setMode('embed')} />
  }

  return (
    <div className="relative flex justify-center items-center gap-10 w-full h-full pt-10 rounded-md">
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex flex-col justify-center items-center gap-4 pb-8 w-full m-auto">
          <SiGoogleslides size={72} className="text-primary" />
          <h2 className="subheading-1 text-primary">
            How would you like to use Google Slides
          </h2>
          <p className="text-center text-foreground">
            Choose an option to start add Google Slides content
          </p>
        </div>
        <div className="flex justify-center items-center gap-8">
          <div
            className={cn(
              'font-semibold aspect-video bg-gray-100 rounded-md p-8 flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
            )}
            onClick={() => setMode('import')}>
            Import Google Slides
          </div>
          <div
            className={cn(
              'font-semibold aspect-video bg-gray-100 rounded-md p-8 flex justify-center items-center cursor-pointer border-2 border-transparent hover:border-primary'
            )}
            onClick={() => setMode('embed')}>
            Embed Google Slides
          </div>
        </div>
        <p className="text-sm font-[300] text-gray-400 text-center pt-4">
          If you want to use Google Slides in single frame, please choose "Embed
          Google Slides" option to embed your Google Slides. If you want to
          import Google Slides as individual frames, please choose "Import
          Google Slides" option.
        </p>
      </div>
    </div>
  )
}
