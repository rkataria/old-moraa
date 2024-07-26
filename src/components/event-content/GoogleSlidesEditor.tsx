/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext, useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Chip, Input } from '@nextui-org/react'
import { Controller, useForm } from 'react-hook-form'
import { BsExclamationCircleFill } from 'react-icons/bs'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { SiGoogleslides } from 'react-icons/si'
import * as yup from 'yup'

import { FrameFormContainer } from './FrameFormContainer'
import { ContentLoading } from '../common/ContentLoading'
import { GoogleSlideEmbed } from '../common/GoogleSlideEmbed'
import { Loading } from '../common/Loading'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { IFrame } from '@/types/frame.type'

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

interface GoogleSlidesEditorProps {
  frame: IFrame & {
    content: {
      googleSlideURL: string
      startPosition?: number
    }
  }
}

export function GoogleSlidesEditor({ frame }: GoogleSlidesEditorProps) {
  const { updateFrame, importGoogleSlides } = useContext(
    EventContext
  ) as EventContextType
  const googleSlideEmbedForm = useForm<GoogleSlideEmbedFormData>({
    resolver: yupResolver(googleSlidesEmbedSchema),
    defaultValues: {
      googleSlideUrl: '',
      startPosition: 1,
      endPosition: undefined,
      importAsIndividualFrames: false,
    },
  })

  const [importingSlidesStatus, setImportingSlidesStatus] = useState('')

  const [mode, setMode] = useState(
    frame.content.googleSlideURL || frame.content?.googleSlideUrl
      ? 'display'
      : 'edit'
  )

  useEffect(() => {
    if (frame.content.googleSlideURL || frame.content.googleSlideUrl) {
      setMode('display')
    }
  }, [frame.content.googleSlideURL, frame.content.googleSlideUrl])

  const saveGoogleSlidesLink = (formValues: GoogleSlideEmbedFormData) => {
    if (
      frame.content.googleSlideURL === formValues.googleSlideUrl &&
      frame.content.startPosition === formValues.startPosition
    ) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frame.content,
          googleSlideURL: formValues.googleSlideUrl,
          startPosition: formValues.startPosition,
          endPositon: formValues.endPosition,
          importAsIndividualFrames: formValues.importAsIndividualFrames,
        },
      },
      frameId: frame.id,
    })
    setMode('loading')
  }

  const handleImportSlides = async (formValues: GoogleSlideEmbedFormData) => {
    setImportingSlidesStatus('pending')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importResponse: any = await importGoogleSlides({
      frame,
      googleSlideUrl: formValues.googleSlideUrl,
      startPosition: formValues.startPosition || 1,
      endPosition: formValues.endPosition,
    })

    if (importResponse?.success) {
      setImportingSlidesStatus('done')
      setTimeout(() => {
        setImportingSlidesStatus('')
      }, 1000)

      return
    }

    if (importResponse?.message) {
      setImportingSlidesStatus(importResponse?.message)
    }
  }

  const handleEmbed = async (formValues: GoogleSlideEmbedFormData) => {
    saveGoogleSlidesLink(formValues)
    setMode('loading')

    if (formValues.importAsIndividualFrames) {
      handleImportSlides(formValues)
    }
  }

  if (mode === 'loading') {
    return <ContentLoading message="Please wait..." />
  }

  if (mode === 'edit') {
    return (
      <FrameFormContainer
        headerIcon={<SiGoogleslides size={72} className="text-primary" />}
        headerTitle="Import/Embed Google Slides"
        headerDescription="Easily import and embed editable Google Slides into Moraa Frame for seamless integration and smooth editing."
        footerNote="Publicly accessible Google Slides can only be imported as Moraa Frames.">
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
              placeholder="Enter google slides url"
              isInvalid={!!fieldState.error?.message}
              errorMessage={fieldState.error?.message}
              classNames={{
                inputWrapper: 'shadow-none',
              }}
            />
          )}
        />
        <div className="flex items-center gap-4">
          <Controller
            control={googleSlideEmbedForm.control}
            name="startPosition"
            render={({ field, fieldState }) => (
              <Input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(field as any)}
                variant="bordered"
                color="primary"
                label="Presentation Start Position"
                type="number"
                className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                placeholder="Enter start position"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                classNames={{
                  inputWrapper: 'shadow-none',
                }}
              />
            )}
          />

          <Controller
            control={googleSlideEmbedForm.control}
            name="endPosition"
            render={({ field, fieldState }) => (
              <Input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(field as any)}
                variant="bordered"
                color="primary"
                label="Presentation End Position"
                type="number"
                className="focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                placeholder="Enter end position"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                classNames={{
                  inputWrapper: 'shadow-none',
                }}
              />
            )}
          />
        </div>
        <Controller
          control={googleSlideEmbedForm.control}
          name="importAsIndividualFrames"
          render={({ field, fieldState }) => (
            <Checkbox
              size="sm"
              className="items-baseline"
              isSelected={field.value}
              isInvalid={!!fieldState.error?.message}
              onValueChange={(value) => field.onChange(value)}>
              I would like to import Google Slides into Moraa Frames.
            </Checkbox>
          )}
        />

        <Button
          variant="bordered"
          color="primary"
          disabled={!googleSlideEmbedForm.formState.isValid}
          type="submit"
          onClick={googleSlideEmbedForm.handleSubmit(handleEmbed)}>
          {googleSlideEmbedForm.getValues('importAsIndividualFrames')
            ? 'Import Google Slides'
            : 'Embed Google Slides'}
        </Button>
      </FrameFormContainer>
    )
  }

  const embededUrl =
    frame.content.googleSlideURL || (frame.content.googleSlideUrl as string)

  const getImportStatus = () => {
    if (!importingSlidesStatus) {
      return null
    }

    return (
      <Chip
        startContent={
          importingSlidesStatus === 'done' ? (
            <IoCheckmarkCircleSharp color="#5cb85c" size={20} />
          ) : importingSlidesStatus === 'pending' ? (
            <Loading />
          ) : (
            <BsExclamationCircleFill size={20} color="#ffcc00" />
          )
        }
        classNames={{
          base: 'absolute bottom-0 left-0 m-4 bg-white shadow-lg',
        }}>
        {importingSlidesStatus === 'pending'
          ? '  Please wait while we are importing frames. This may take a few minutes!'
          : importingSlidesStatus}
      </Chip>
    )
  }

  if (frame.content.importAsIndividualFrames) {
    return (
      <div className="relative w-full h-full">
        <iframe
          src={embededUrl}
          className="w-full h-full"
          title="google-slide"
        />
        {getImportStatus()}
      </div>
    )
  }

  return (
    <GoogleSlideEmbed
      url={embededUrl}
      showControls={!frame.content?.individualFrame}
      startPage={frame.content.startPosition}
    />
  )
}
