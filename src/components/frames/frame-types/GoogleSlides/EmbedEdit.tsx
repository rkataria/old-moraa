/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/iframe-has-title */
import { useState } from 'react'

import { Input } from '@heroui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { SiGoogleslides } from 'react-icons/si'
import * as yup from 'yup'

import { IframeEdit } from './IframeEdit'

import { ContentLoading } from '@/components/common/ContentLoading'
import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { Button } from '@/components/ui/Button'
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

type EmbedEditProps = {
  frame: GoogleSlidesFrame
  hideImportLink?: boolean
  onChangeMode: () => void
}

export function EmbedEdit({
  frame,
  hideImportLink,
  onChangeMode,
}: EmbedEditProps) {
  const [loading, setLoading] = useState(false)
  const { updateFrame } = useEventContext()
  const googleSlideEmbedForm = useForm<GoogleSlideEmbedFormData>({
    resolver: yupResolver(googleSlidesEmbedSchema),
    defaultValues: {
      googleSlideUrl: '',
      startPosition: 1,
      endPosition: undefined,
      importAsIndividualFrames: false,
    },
  })

  const saveGoogleSlidesLink = (formValues: GoogleSlideEmbedFormData) => {
    setLoading(true)
    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          googleSlideUrl: formValues.googleSlideUrl,
          startPosition: formValues.startPosition,
          endPositon: formValues.endPosition,
          importAsIndividualFrames: formValues.importAsIndividualFrames,
        },
      },
      frameId: frame.id,
    })
  }

  if (frame.content?.googleSlideUrl) {
    return (
      <IframeEdit
        url={frame.content.googleSlideUrl}
        onLoad={() => setLoading(false)}
      />
    )
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
        headerTitle="Embed Google Slides"
        headerDescription="Easily embed editable Google Slides into Moraa Frame for seamless integration and smooth editing."
        footerNote="Make sure you have access to the Google Slides for seamless editing and the content you want to embed is public accessible or shared with participants for the best experience">
        <Controller
          control={googleSlideEmbedForm.control}
          name="googleSlideUrl"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              variant="faded"
              color="primary"
              label="Google Slides URL"
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
          variant="flat"
          color="primary"
          isLoading={googleSlideEmbedForm.formState.isSubmitting}
          type="submit"
          onClick={googleSlideEmbedForm.handleSubmit(saveGoogleSlidesLink)}>
          Embed Presentation
        </Button>
      </FrameFormContainer>
      {!hideImportLink && (
        <p
          className="text-center underline text-primary"
          onClick={onChangeMode}>
          I want to import Google Slides.
        </p>
      )}
    </div>
  )
}
