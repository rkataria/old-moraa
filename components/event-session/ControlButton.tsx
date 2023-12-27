import { DyteButton } from "@dytesdk/react-ui-kit"
import clsx from "clsx"

export type ControlButtonProps = {
  children?: React.ReactNode | string
  active?: boolean
  className?: string
  onClick?: () => void
}

export function ControlButton({
  children,
  active,
  className = "",
  ...rest
}: ControlButtonProps) {
  return (
    <DyteButton
      class={clsx(className, {
        "bg-white/10 text-white": !active,
        "bg-white text-black": active,
      })}
      {...rest}
    >
      {children}
    </DyteButton>
  )
}

export default ControlButton
