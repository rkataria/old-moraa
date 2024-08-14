import { extendVariants, Button as NextUIButton } from '@nextui-org/react'

export const Button = extendVariants(NextUIButton, {
  variants: {
    color: {
      brand: 'text-[#FFF] bg-[#7C3AED]',
    },
    size: {
      sm: 'rounded-md text-md h-8',
      md: 'rounded-md text-lg h-10',
      lg: 'rounded-md text-xl h-12',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
