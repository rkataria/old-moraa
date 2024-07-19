/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { TbApps } from 'react-icons/tb'

import { EventSessionContext } from '@/contexts/EventSessionContext'
import { EventSessionContextType } from '@/types/event-session.type'
import { cn } from '@/utils/utils'

export function AppsToggle() {
  const [isContentVisible, setIsContentVisible] = useState(false) // Set initial state to false
  const { isHost } = useContext(EventSessionContext) as EventSessionContextType

  const togglePopoverContent = () => {
    setIsContentVisible(true) // Ensure PopoverContent is always visible when the button is clicked
  }

  return (
    <Popover placement="bottom" offset={15}>
      <div />
      {isHost && (
        <>
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
          <PopoverContent>
            {/* Add your popover content here */}
            <div style={{ padding: '10px' }}>
              {/* This is a placeholder content */}
              Popover Content
            </div>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}
