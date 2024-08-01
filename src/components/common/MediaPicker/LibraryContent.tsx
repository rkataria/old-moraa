import { Input } from '@nextui-org/react'
import { IoSearchOutline } from 'react-icons/io5'
import { TbLibraryPhoto } from 'react-icons/tb'

export function LibraryContent() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <Input
        placeholder="Search library"
        labelPlacement="outside"
        fullWidth
        radius="sm"
        className="shadow-none"
        variant="bordered"
        startContent={
          <IoSearchOutline className="text-2xl text-primary-200 pointer-events-none flex-shrink-0" />
        }
      />
      <div className="flex-auto flex flex-col justify-center items-center gap-2">
        <TbLibraryPhoto size={128} className="text-primary-200" />
        <p className="text-center w-2/3">
          <span className="text-sm text-gray-400 text-center">
            Upload your media files to use them in your projects and designs
          </span>
        </p>
        <p>Coming soon</p>
        {/* <Button size="sm" variant="light" color="primary">
          Go to Library
        </Button> */}
      </div>
    </div>
  )
}
