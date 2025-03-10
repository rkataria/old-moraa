/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/iframe-has-title */
import { useState } from 'react'

import { Button, Input } from '@heroui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { SiGoogleslides } from 'react-icons/si'
import * as yup from 'yup'

import { IframeEdit } from './IframeEdit'

import { ContentLoading } from '@/components/common/ContentLoading'
import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { useEventContext } from '@/contexts/EventContext'
import { type GoogleSlidesFrame } from '@/types/frame-picker.type'

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

type ImportEditProps = {
  frame: GoogleSlidesFrame
  onChangeMode: () => void
}

export function ImportEdit({ frame, onChangeMode }: ImportEditProps) {
  const [loading, setLoading] = useState(false)
  const { importGoogleSlides } = useEventContext()
  const googleSlideEmbedForm = useForm<GoogleSlideEmbedFormData>({
    resolver: yupResolver(googleSlidesEmbedSchema),
    defaultValues: {
      googleSlideUrl: '',
      startPosition: 1,
      endPosition: undefined,
      importAsIndividualFrames: true,
    },
  })

  const handleImportSlides = async (formValues: GoogleSlideEmbedFormData) => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importResponse: any = await importGoogleSlides({
      frame,
      googleSlideUrl: formValues.googleSlideUrl,
      startPosition: formValues.startPosition || 1,
      endPosition: formValues.endPosition,
    })

    if (importResponse?.success) {
      setLoading(false)

      return
    }

    if (importResponse?.message) {
      console.log(importResponse?.message)
    }
  }

  if (frame.content?.googleSlideUrl) {
    return <IframeEdit url={frame.content.googleSlideUrl} />
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ContentLoading />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <FrameFormContainer
        headerIcon={<SiGoogleslides size={72} className="text-primary" />}
        headerTitle="Import Google Slides"
        headerDescription="Easily import Google Slides into Moraa Frames and get started."
        footerNote="Make sure you have access to the Google Slides you want to import">
        <Controller
          control={googleSlideEmbedForm.control}
          name="googleSlideUrl"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="bordered"
              color="primary"
              label="Google Slides URL"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              placeholder="Paste google slides url"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              classNames={{
                inputWrapper: 'shadow-none',
              }}
            />
          )}
        />
        <Button
          size="md"
          variant="ghost"
          color="primary"
          isLoading={googleSlideEmbedForm.formState.isSubmitting}
          type="submit"
          onClick={googleSlideEmbedForm.handleSubmit(handleImportSlides)}>
          Import Presentation
        </Button>
      </FrameFormContainer>
      <p className="text-center underline text-primary" onClick={onChangeMode}>
        I want to embed Google Slides.
      </p>
    </div>
  )
}
