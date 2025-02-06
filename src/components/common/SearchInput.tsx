import { Input, InputProps } from '@nextui-org/react'
import { SearchIcon } from 'lucide-react'

export function SearchInput({
  onSearch,
  inputProps = {},
}: {
  onSearch: (value: string) => void
  inputProps?: InputProps
}) {
  return (
    <Input
      name="search"
      isClearable
      radius="sm"
      placeholder="Type to search..."
      className="shadow-none"
      onValueChange={(v) => onSearch(v)}
      startContent={
        <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 h-4 w-4" />
      }
      {...inputProps}
    />
  )
}
