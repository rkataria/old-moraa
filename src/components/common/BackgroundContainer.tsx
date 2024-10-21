import { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { RenderIf } from './RenderIf/RenderIf'

type BackgroundContainerProps = {
  children: ReactNode
  gradientStyle?: string
  animateLogo?: boolean
  showLogo?: boolean
}

export function BackgroundContainer({
  children,
  gradientStyle = 'linear-gradient(123deg, #1C0993 0.31%, #9585FF 69.5%)',
  animateLogo = true,
  showLogo,
}: BackgroundContainerProps) {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden "
      style={{
        background: gradientStyle,
      }}>
      <RenderIf isTrue={!!showLogo}>
        <motion.svg
          animate={
            animateLogo
              ? {
                  y: [100, 0, 100],
                }
              : false
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          width="406"
          height="440"
          viewBox="0 0 406 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 bottom-0 w-[37vw] h-[37vw]">
          <path
            d="M329.459 228.245L295.054 272.838C366.084 306.282 354.985 386.549 313.922 422.224C291.725 441.176 255.1 450.094 225.135 434.487C199.609 422.224 174.082 394.353 146.336 353.105C138.568 341.957 125.25 320.775 118.591 309.627C111.932 298.479 118.591 282.871 134.128 287.33C276.187 323.005 380.512 156.896 276.187 42.07C216.256 -22.5896 121.92 -4.75246 73.0873 42.07C24.2546 88.8924 19.8153 132.37 32.0234 190.341L91.9545 203.719C68.648 85.548 140.787 47.6441 198.499 63.2516C244.002 75.5146 290.615 146.863 235.123 208.178C147.446 305.168 -22.3585 137.945 -135.562 252.771C-260.973 379.861 -90.0584 587.217 63.0988 464.587C75.307 454.554 81.966 445.635 94.1742 424.453L58.6595 373.172C34.2431 419.994 0.948066 442.29 -33.4568 442.29C-93.3879 442.29 -134.452 378.746 -113.365 323.005C-87.8387 256.115 8.71691 250.541 45.3415 304.053C99.7234 384.32 138.568 446.75 180.741 475.735C246.222 520.328 325.02 496.917 362.754 457.898C419.356 401.042 431.564 289.56 330.569 226.015L329.459 228.245Z"
            fill="#3C2AB0"
            fillOpacity="0.33"
          />
        </motion.svg>
      </RenderIf>

      {children}
    </div>
  )
}
