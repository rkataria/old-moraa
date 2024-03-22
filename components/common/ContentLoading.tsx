import { Loading } from './Loading'

type ContentLoadingProps = {
  message?: string
}

export function ContentLoading({
  message = 'Please wait...',
}: ContentLoadingProps) {
  return (
    <div className="flex justify-center items-center w-full h-full bg-white rounded-md">
      <div>
        <Loading />
        <p>{message}</p>
      </div>
    </div>
  )
}
