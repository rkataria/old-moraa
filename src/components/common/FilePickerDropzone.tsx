/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback } from 'react'

import clsx from 'clsx'
import { Accept, useDropzone } from 'react-dropzone'

export type FilePickerDropzoneType = {
  supportedFormats: Accept
  fullWidth?: boolean
  // Upload progress is a number from 1 to 100 which represent the upload status.
  uploadProgress?: number
  classNames?: {
    wrapper: string
  }
  label?: string
  onUpload: (files: File[] | null) => void
}

export function FilePickerDropzone({
  onUpload,
  supportedFormats,
  fullWidth,
  classNames,
  uploadProgress,
  label,
}: FilePickerDropzoneType) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onUpload(acceptedFiles)
    },
    [onUpload]
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: supportedFormats,
  })

  return (
    <div
      className={clsx(
        'font-sans border-box flex justify-center mx-auto rounded-lg relative overflow-hidden',
        'border-2 border-dashed border-primary-200',
        { 'w-96': !fullWidth, 'w-full': fullWidth },
        classNames?.wrapper
      )}>
      <div
        className={clsx(
          'flex flex-col items-center justify-center w-full h-auto',
          'relative bg-primary-50',
          {
            'w-4/5 h-32 max-w-xs': !fullWidth,
            'w-full h-full py-12': fullWidth,
          }
        )}
        {...getRootProps()}>
        <form action="#" className="w-full h-full">
          <input {...getInputProps()} id="file-upload" />
          <div className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer">
            <p className="z-10 text-xs font-light text-center text-gray-500">
              {label || 'Drag & Drop your file(s) here'}
            </p>
            <svg
              className="z-10 w-8 h-8 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
        </form>
      </div>
      {uploadProgress ? (
        <>
          <div
            className={clsx(
              'absolute rounded-lg top-0 bottom-0 left-0 right-0 flex items-center justify-center'
            )}
            style={{ backdropFilter: 'blur(4px)', zIndex: 200 }}>
            Uploading... ({uploadProgress}%)
          </div>
          <div
            style={{
              right: `${100 - uploadProgress}%`,
              zIndex: 300,
              transition: 'right 200ms ease',
            }}
            className={clsx(
              'rounded-lg bg-[#7c3aed] opacity-10 absolute top-0 bottom-0 left-0'
            )}
          />
        </>
      ) : null}
    </div>
  )
}
