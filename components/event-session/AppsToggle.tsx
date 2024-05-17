/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useState } from 'react'

import { TbApps } from 'react-icons/tb'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { CodeEditorToggle } from './CodeEditorToggle'
import { Timer } from './Timer'
import { WhiteBoardToggle } from './WhiteBoardToggle'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function AppsToggle() {
  const [isContentVisible, setIsContentVisible] = useState(false) // Set initial state to false
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const collapsePopoverContent = () => {
    setIsContentVisible(false) // Set visibility to false when collapsing
  }

  const togglePopoverContent = () => {
    setIsContentVisible(true) // Ensure PopoverContent is always visible when the button is clicked
  }

  return (
    <Popover placement="bottom" offset={15}>
      {isHost && (
        <PopoverTrigger>
          <div>
            <button
              type="button"
              onClick={togglePopoverContent}
              style={{
                backgroundColor: isContentVisible
                  ? 'rgb(8, 8, 8)'
                  : 'rgb(241, 241, 242)', // Corrected colors
                color: isContentVisible ? 'white' : 'black', // Ensures text color is black initially and white when active
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className={cn('hover:bg-[#1E1E1E]', {
                'text-white': isContentVisible, // This class is now redundant given the inline style but kept for hover handling
              })}>
              <TbApps size={20} />
            </button>
          </div>
        </PopoverTrigger>
      )}
      <PopoverContent
        hidden={!isContentVisible}
        className={cn(
          'pt-2 bg-black/90 min-w-[500px] aspect-video text-white flex flex-row gap-2 justify-normal items-start'
        )}>
        <Timer
          collapsePopoverContent={collapsePopoverContent}
          dismissPopover={collapsePopoverContent} // Pass dismissPopover function
        />
        <WhiteBoardToggle />
        <CodeEditorToggle />
      </PopoverContent>
    </Popover>
  )
}
