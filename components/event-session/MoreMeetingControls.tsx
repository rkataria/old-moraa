/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext } from 'react'

import { TbAppsFilled } from 'react-icons/tb'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { Timer } from './Timer'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function MoreMeetingControls() {
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false) // Set initial state to false
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const collapsePopoverContent = () => {
    setIsContentVisible(false) // Set visibility to false when collapsing
  }

  const togglePopoverContent = () => {
    setIsContentVisible(true) // Ensure PopoverContent is always visible when the button is clicked
  }

  return (
    <Popover placement="bottom" offset={32}>
      {isHost && ( // Render the button only if isHost is true
        <PopoverTrigger>
          <button
            type="button"
            onClick={togglePopoverContent}
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
      )}
      <PopoverContent
        hidden={!isContentVisible}
        className="p-1 bg-black/90 min-w-[500px] aspect-video text-white flex justify-start items-start">
        <Timer
          collapsePopoverContent={collapsePopoverContent}
          // setIsPopoverOpen={setIsPopoverOpen}
          dismissPopover={collapsePopoverContent} // Pass dismissPopover function
        />
      </PopoverContent>
    </Popover>
  )
}
