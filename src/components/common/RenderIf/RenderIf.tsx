interface Props {
  isTrue: boolean
}

export function RenderIf({ children, isTrue }: React.PropsWithChildren<Props>) {
  return isTrue && children ? children : null
}
