import { extendVariants, Button as NextUIButton } from '@nextui-org/react'

export const Button = extendVariants(NextUIButton, {
  variants: {
    color: {
      brand: 'text-white bg-primary',
    },
    size: {
      sm: 'rounded-md text-md h-8',
      md: 'rounded-md text-md h-10',
      lg: 'rounded-md text-base h-12',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
