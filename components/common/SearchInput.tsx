import { SearchIcon } from 'lucide-react'

import { Input, InputProps } from '@nextui-org/react'

export function SearchInput({
  onSearch,
  inputProps = {},
}: {
  onSearch: (value: string) => void
  inputProps?: InputProps
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = new FormData(e.currentTarget).get(
      inputProps.name || 'search'
    ) as string
    onSearch(value)
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="search"
        isClearable
        radius="lg"
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 h-4 w-4" />
        }
        {...inputProps}
      />
    </form>
  )
}
