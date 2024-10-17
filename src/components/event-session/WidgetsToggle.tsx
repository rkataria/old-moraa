import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

import { MeetingRecordingButton } from './MeetingRecordingButton'
import { TimerToggle } from './TimerToggle'
import { WhiteBoardToggle } from './WhiteBoardToggle'
import { BreakoutFooterButton } from '../common/breakout/BreakoutFooterButton'
import { Button } from '../ui/Button'

import { cn } from '@/utils/utils'

export function WidgetsToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* For enabling shortcuts when popup is not open */}
      <div className="hidden w-0 h-0 overflow-hidden">
        <WhiteBoardToggle />
        <TimerToggle />
      </div>

      <Popover
        placement="top"
        showArrow
        offset={10}
        isOpen={isOpen}
        onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <Button
            isIconOnly
            size="sm"
            className={cn('bg-[#F3F4F6]', {
              'bg-primary-100': isOpen,
            })}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M27.1395 3.39879e-05C26.9002 -0.00243268 26.6807 0.129534 26.5746 0.340434L23.865 5.74243L17.797 6.60577C17.2876 6.67977 17.0841 7.29643 17.4541 7.64917L22.147 11.8511L20.9716 17.7835C20.8853 18.2842 21.4193 18.6653 21.8756 18.4285L27.1333 15.6264L32.4194 18.4297C32.8757 18.6641 33.4061 18.2842 33.3222 17.7859L32.1604 11.8536L36.8101 7.6504C37.1801 7.29767 36.9778 6.67977 36.4672 6.607L30.4041 5.74367L27.6908 0.341667C27.5872 0.135701 27.3738 0.00250065 27.1395 3.39879e-05ZM27.1333 1.99187L29.431 6.56753C29.5211 6.75007 29.6974 6.87587 29.8997 6.90423L35.0402 7.63807L31.0603 11.2024C30.9123 11.3405 30.8469 11.5428 30.8814 11.7401L31.8841 16.7721L27.4244 14.3955C27.2431 14.3018 27.0273 14.3018 26.8447 14.3955L22.4171 16.7709L23.4321 11.7389C23.4666 11.5416 23.3988 11.3381 23.2533 11.1987L19.2301 7.63437L24.3682 6.90177C24.5717 6.8734 24.7468 6.7476 24.8369 6.5663L27.1333 1.99187ZM20.35 22.2C19.3362 22.2 18.5 23.0362 18.5 24.05V35.15C18.5 36.1638 19.3362 37 20.35 37H31.45C32.4638 37 33.3 36.1638 33.3 35.15V24.05C33.3 23.0362 32.4638 22.2 31.45 22.2H20.35ZM20.35 23.4334H31.45C31.8027 23.4334 32.0667 23.6973 32.0667 24.05V35.15C32.0667 35.5028 31.8027 35.7667 31.45 35.7667H20.35C19.9973 35.7667 19.7333 35.5028 19.7333 35.15V24.05C19.7333 23.6973 19.9973 23.4334 20.35 23.4334ZM1.85 3.70003C0.8362 3.70003 0 4.53623 0 5.55003V16.65C0 17.6638 0.8362 18.5 1.85 18.5H12.95C13.9638 18.5 14.8 17.6638 14.8 16.65V5.55003C14.8 4.53623 13.9638 3.70003 12.95 3.70003H1.85ZM1.85 4.93337H12.95C13.3027 4.93337 13.5667 5.1973 13.5667 5.55003V16.65C13.5667 17.0028 13.3027 17.2667 12.95 17.2667H1.85C1.49727 17.2667 1.23333 17.0028 1.23333 16.65V5.55003C1.23333 5.1973 1.49727 4.93337 1.85 4.93337ZM1.85 22.2C0.8362 22.2 0 23.0362 0 24.05V35.15C0 36.1638 0.8362 37 1.85 37H12.95C13.9638 37 14.8 36.1638 14.8 35.15V24.05C14.8 23.0362 13.9638 22.2 12.95 22.2H1.85ZM1.85 23.4334H12.95C13.3027 23.4334 13.5667 23.6973 13.5667 24.05V35.15C13.5667 35.5028 13.3027 35.7667 12.95 35.7667H1.85C1.49727 35.7667 1.23333 35.5028 1.23333 35.15V24.05C1.23333 23.6973 1.49727 23.4334 1.85 23.4334Z"
                fill="black"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[240px] rounded-xl p-2">
          <div>
            <WhiteBoardToggle />
            <TimerToggle />
            <BreakoutFooterButton />
            <MeetingRecordingButton />
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
