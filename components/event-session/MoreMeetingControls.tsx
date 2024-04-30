/* eslint-disable jsx-a11y/control-has-associated-label */

import { TbAppsFilled } from 'react-icons/tb'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { Timer } from './Timer'

import { cn } from '@/utils/utils'

export function MoreMeetingControls() {
  return (
    <Popover placement="bottom" offset={32}>
      <PopoverTrigger>
        <button
          type="button"
          onClick={() => {}}
          style={{
            backgroundColor:
              'var(--dyte-controlbar-button-background-color, rgb(var(--dyte-colors-background-1000, 8 8 8)))',
          }}
          className={cn(
            'flex flex-col justify-center items-center gap-[5px] w-14 h-10 rounded-sm hover:bg-[#1E1E1E] text-white'
          )}>
          <TbAppsFilled className="text-2xl text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1 bg-black/90 min-w-[500px] aspect-video text-white flex justify-start items-start">
        <Timer />
      </PopoverContent>
    </Popover>
  )
}
