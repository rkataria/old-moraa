/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

export type FilePickerType = {
  label: string
  supportedFormats: string[]
  onUpload: (files: FileList | null) => void
}

export function FilePicker({
  label,
  onUpload,
  supportedFormats,
}: FilePickerType) {
  return (
    <div>
      <div className="font-sans border-box">
        <div className="flex justify-center w-96 mx-auto">
          <div className="flex flex-col items-center justify-center w-full h-auto my-20">
            <div className="mt-10 mb-10 text-center">
              <h4 className="text-2xl font-semibold mb-2">
                {label || 'Upload your file(s)'}
              </h4>
              {supportedFormats ? (
                <p className="text-xs text-gray-500">
                  File should be of format{' '}
                  {supportedFormats.map((f) => f.split('/')[1]).join(', ')}
                </p>
              ) : null}
            </div>
            <form
              action="#"
              className="relative w-4/5 h-32 max-w-xs mb-10 bg-white bg-gray-100 rounded-lg border border-gray-400">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept={supportedFormats.join(', ')}
                onChange={(e) => onUpload(e.target.files)}
              />
              <label
                htmlFor="file-upload"
                className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer">
                <p className="z-10 text-xs font-light text-center text-gray-500">
                  Drag & Drop your file(s) here
                </p>
                <svg
                  className="z-10 w-8 h-8 text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
