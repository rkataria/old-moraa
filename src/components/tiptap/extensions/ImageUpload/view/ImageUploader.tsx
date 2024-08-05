// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// import { Button } from '@components/tiptap/ui/Button'

import { FileUploader } from '@/components/event-content/FileUploader'

export function ImageUploader({
  onUpload,
}: {
  onUpload: (url: string) => void
}) {
  // const { loading, uploadFile } = useUploader({ onUpload })
  // const { handleUploadClick, ref } = useFileUpload()
  // const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
  //  uploader: uploadFile,
  //  })

  // const onFileChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) =>
  //     e.target.files ? uploadFile(e.target.files[0]) : null,
  //   [uploadFile]
  // )

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
  //       <Spinner className="text-neutral-500" size={1.5} />
  //     </div>
  //   )
  // }

  // const wrapperClass = cn(
  //   'flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80',
  //   draggedInside && 'bg-neutral-100'
  // )

  const handleFileUpload = (files: FileWithoutSignedUrl[]) => {
    const file = files?.[0]
    onUpload(file.url)
  }

  return (
    <div className="tiptap-uppy-upload" contentEditable={false}>
      <FileUploader
        maxNumberOfFiles={1}
        allowedFileTypes={['.jpg', '.jpeg', '.png']}
        bucketName="image-uploads"
        useModal={false}
        onPublicFilesUploaded={handleFileUpload}
      />
    </div>
  )

  // return (
  //   <div
  //     className={wrapperClass}
  //     onDrop={onDrop}
  //     onDragOver={onDragEnter}
  //     onDragLeave={onDragLeave}
  //     contentEditable={false}>
  //     <Icon
  //       name="Image"
  //       className="w-12 h-12 mb-4 text-black dark:text-white opacity-20"
  //     />
  //     <FileUploader
  //       maxNumberOfFiles={1}
  //       allowedFileTypes={['.jpg', '.jpeg', '.png']}
  //       bucketName="image-uploads"
  //       useModal={false}
  //       onPublicFilesUploaded={(files) => console.log('files', files)}
  //     />
  //     {/* <div className="flex flex-col items-center justify-center gap-2">
  //       <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
  //         {draggedInside ? 'Drop image here' : 'Drag and drop or'}
  //       </div>
  //       <div>
  //         <Button
  //           disabled={draggedInside}
  //           onClick={handleUploadClick}
  //           variant="primary"
  //           buttonSize="small">
  //           <Icon name="Upload" />
  //           Upload an image
  //         </Button>
  //       </div>
  //     </div>
  //     <input
  //       className="w-0 h-0 overflow-hidden opacity-0"
  //       ref={ref}
  //       type="file"
  //       accept=".jpg,.jpeg,.png,.webp,.gif"
  //       onChange={onFileChange}
  //     /> */}
  //   </div>
  // )
}

// eslint-disable-next-line import/no-default-export
export default ImageUploader
