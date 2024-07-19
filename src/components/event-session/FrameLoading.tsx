import { Loading } from '../common/Loading'

export function FrameLoading() {
  return (
    <div className="absolute h-full w-full flex justify-center items-center">
      <Loading />
    </div>
  )
}
