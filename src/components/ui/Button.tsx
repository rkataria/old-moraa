import {
  ButtonProps,
  extendVariants,
  Button as NextUIButton,
} from '@nextui-org/react'

export const Button = extendVariants(NextUIButton, {
  variants: {
    gradient: {
      none: '',
      primary: 'bg-gradient-to-r from-blue-500 to-primary-500 text-white',
    },
    color: {
      brand: 'text-white bg-primary',
      default: 'hover:bg-opacity-90',
    },
    size: {
      sm: 'rounded-md text-sm h-7',
      md: 'rounded-md text-md h-9',
      lg: 'rounded-md text-base h-11',
    },
  },
  defaultVariants: {
    gradient: 'none',
    size: 'sm',
    color: 'default',
  },
}) as React.FC<
  ButtonProps & { preventFocusOnPress?: boolean; gradient?: 'none' | 'primary' }
>

Button.defaultProps = {
  preventFocusOnPress: true,
}
