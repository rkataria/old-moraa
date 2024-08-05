import { useEffect, useState } from 'react'

import { Input } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'
import { IoSearchOutline } from 'react-icons/io5'

type SearchInputProps = {
  placeholder?: string
  debounce?: number
  onChange?: (value: string) => void
}

export function SearchInput({
  placeholder = 'Search',
  debounce = 300,
  onChange,
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, debounce)

  useEffect(() => {
    onChange?.(debouncedValue)
  }, [debouncedValue, onChange])

  return (
    <Input
      placeholder={placeholder}
      labelPlacement="outside"
      fullWidth
      radius="sm"
      className="shadow-none"
      variant="bordered"
      startContent={
        <IoSearchOutline className="text-2xl text-primary-200 pointer-events-none flex-shrink-0" />
      }
      onChange={(e) => {
        setValue(e.target.value)
      }}
    />
  )
}
