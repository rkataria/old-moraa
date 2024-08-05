import { Input } from '@nextui-org/react'
import { IoSearchOutline } from 'react-icons/io5'
import { SiIcons8 } from 'react-icons/si'

export function Icon8Content() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <Input
        placeholder="Search Icon8"
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
        <SiIcons8 size={128} className="text-primary-200" />
        <p className="text-center w-2/3">
          <span className="text-sm text-gray-400 text-center">
            Search and use icons from Icon8 in your projects and designs
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
