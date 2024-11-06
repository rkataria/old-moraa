import { Checkbox, cn } from '@nextui-org/react'

import { Minutes } from './Minutes'

export function NewFramePlaceholder() {
  return (
    <div className="relative w-full bg-white min-h-[40px] grid grid-cols-[40px_100px_120px_1fr_1fr_70px] hover:bg-gray-50 border-b last:border-none last:rounded-b-xl duration-300 opacity-50">
      <div className="grid place-items-center border-r">
        <Checkbox
          size="md"
          isDisabled
          classNames={{
            wrapper: 'mr-0 grid',
            icon: 'text-white',
          }}
        />
      </div>

      <Minutes
        minutes={0}
        onChange={() => {}}
        className="grid p-2 place-items-center pointer-events-none"
      />
      <div
        className={cn(
          'relative bg-[#C4C4C4] w-full h-full right-0 top-0 grid place-items-center cursor-pointer group/color_code_2'
        )}>
        <p>None</p>
      </div>
      <div
        className="relative rounded-md flex items-center gap-1 p-2 pl-6 min-w-[100px] group/frame-name cursor-pointer"
        style={{ flex: 3 }}>
        <p>+ Add Frame</p>
      </div>

      <p className="border-x-1 px-4 py-2 cursor-text">Note</p>

      <div className="grid items-center justify-center scale-75">
        <Checkbox
          size="lg"
          isDisabled
          classNames={{ wrapper: 'mr-0', icon: 'text-white' }}
        />
      </div>
    </div>
  )
}
