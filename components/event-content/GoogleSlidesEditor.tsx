/* eslint-disable jsx-a11y/label-has-associated-control */

'use client'

import { useContext, useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { BsExclamationCircleFill } from 'react-icons/bs'
import { IoCheckmarkCircleSharp, IoLinkOutline } from 'react-icons/io5'
import * as yup from 'yup'

import { Button, Checkbox, Chip, Input } from '@nextui-org/react'

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
      <div className="flex items-center justify-center flex-col mt-4 h-full">
        <div className="grid gap-4 w-full max-w-[40rem] bg-[#f7f7f7] p-[6.25rem] rounded-[2.5rem]">
          <Controller
            control={googleSlideEmbedForm.control}
            name="googleSlideUrl"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                variant="bordered"
                className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                placeholder="Enter Google Slide Url"
                isInvalid={!!fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                startContent={
                  <IoLinkOutline
                    size={24}
                    className="text-gray-400 -rotate-45"
                  />
                }
                classNames={{
                  inputWrapper: 'shadow-none border-black/30 border-[1px]',
                }}
              />
            )}
          />
          <div className="flex items-center gap-8">
            <Controller
              control={googleSlideEmbedForm.control}
              name="startPosition"
              render={({ field, fieldState }) => (
                <Input
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(field as any)}
                  variant="bordered"
                  label="Presentation start position"
                  type="number"
                  className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                  placeholder="Enter start position"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  classNames={{
                    inputWrapper: 'shadow-none border-black/30 border-[1px]',
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
                  label="Presentation end position"
                  type="number"
                  className="focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-gray-400"
                  placeholder="Enter end position"
                  isInvalid={!!fieldState.error?.message}
                  errorMessage={fieldState.error?.message}
                  classNames={{
                    inputWrapper: 'shadow-none border-black/30 border-[1px]',
                  }}
                />
              )}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
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
                  Import as Moraa Frames
                </Checkbox>
              )}
            />

            <Button
              type="submit"
              color={
                googleSlideEmbedForm.formState.isValid ? 'primary' : 'default'
              }
              onClick={googleSlideEmbedForm.handleSubmit(handleEmbed)}>
              Embed Slides
            </Button>
          </div>
        </div>
      </div>
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
