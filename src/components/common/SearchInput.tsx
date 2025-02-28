import { useEffect, useState } from 'react'

import { Input, InputProps } from '@heroui/react'
import { useDebounce } from '@uidotdev/usehooks'
import { SearchIcon } from 'lucide-react'

type SearchInputProps = {
  defaultValue?: string
  inputProps?: InputProps
  debounce?: number
  onSearch: (value: string) => void
}

export function SearchInput({
  defaultValue = '',
  inputProps = {},
  debounce = 300,
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState<string>(defaultValue)
  const debouncedQuery = useDebounce(query, debounce)

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <Input
      name="search"
      isClearable
      radius="sm"
      placeholder="Type to search..."
      className="shadow-none"
      value={query}
      onValueChange={(value) => setQuery(value)}
      startContent={
        <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 h-4 w-4" />
      }
      {...inputProps}
    />
  )
}
