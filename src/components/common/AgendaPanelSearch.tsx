import { SearchInput } from './SearchInput'

import { cn } from '@/utils/utils'

type AgendaPanelSearchProps = {
  className?: string
  onSearch: (value: string) => void
}

export function AgendaPanelSearch({
  className,
  onSearch,
}: AgendaPanelSearchProps) {
  return (
    <div className={cn(className)}>
      <SearchInput
        onSearch={onSearch}
        inputProps={{
          variant: 'flat',
          radius: 'md',
          placeholder: 'Search...',
          classNames: { input: 'p-0', inputWrapper: 'h-6 relative' },
        }}
      />
    </div>
  )
}
