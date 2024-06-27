import { IconLoader } from '@tabler/icons-react'

export function Loading({ message = '' }: { message?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
      <div>
        <IconLoader className="animate-spin" />
      </div>
      {message ? <div>{message}</div> : null}
    </div>
  )
}
