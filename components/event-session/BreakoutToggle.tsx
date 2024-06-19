import { ControlButton } from '../common/ControlButton'

import { cn } from '@/utils/utils'

export function BreakoutSlideToggle({
  onClick,
  isActive,
}: {
  onClick: () => void
  isActive: boolean
}) {
  return (
    <ControlButton
      buttonProps={{
        isIconOnly: true,
        radius: 'md',
        variant: 'light',
        className: cn('transition-all duration-300', {
          'bg-black text-white': isActive,
        }),
      }}
      tooltipProps={{
        content: isActive ? 'Hide Breakouts' : 'Show Breakouts',
      }}
      onClick={() => onClick()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <g transform="scale(0.3333)">
          <path
            d="M10.5 3a2.25 2.25 0 0 1 2.25 2.25v6h6A2.25 2.25 0 0 1 21 13.5v5.25A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3h5.25Zm.75 9.75H4.5v6c0 .414.336.75.75.75h5.999l.001-6.75Zm7.5 0h-6.001v6.75h6.001a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75ZM10.5 4.5H5.25a.75.75 0 0 0-.75.75v6h6.75v-6a.75.75 0 0 0-.75-.75Z"
            style={{
              stroke: 'none',
              strokeWidth: 1, // This value might be adjusted if the original stroke was visible and needs scaling
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeDashoffset: 0,
              strokeLinejoin: 'miter',
              strokeMiterlimit: 4,
              fill: '#000',
              fillRule: 'nonzero',
              opacity: 1,
            }}
            transform="matrix(.3 0 0 .3 5.077 5.413)"
          />
          <circle
            r="35"
            fill="none"
            style={{
              stroke: '#000',
              strokeWidth: '11', // Adjusted from 32 to approximately 11 for the scaled-down version
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeDashoffset: 0,
              strokeLinejoin: 'miter',
              strokeMiterlimit: 4,
              fill: '#fff',
              fillOpacity: 0,
              fillRule: 'nonzero',
              opacity: 1,
            }}
            transform="matrix(.02 0 0 .02 10.591 7.09)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </ControlButton>
  )
}
