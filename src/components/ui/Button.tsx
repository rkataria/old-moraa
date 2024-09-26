import {
  ButtonProps,
  extendVariants,
  Button as NextUIButton,
} from '@nextui-org/react'

export const Button = extendVariants(NextUIButton, {
  variants: {
    color: {
      brand: 'text-white bg-primary',
      default: 'bg-gray-100 hover:bg-opacity-90',
    },
    size: {
      sm: 'rounded-md text-md h-8',
      md: 'rounded-md text-md h-10',
      lg: 'rounded-md text-base h-12',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'default',
  },
}) as React.FC<ButtonProps & { preventFocusOnPress?: boolean }>

Button.defaultProps = {
  preventFocusOnPress: true,
}
