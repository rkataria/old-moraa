type LoadErrorProps = {
  invalidUrl: boolean
  canUpdateFrame: boolean
}

export function LoadError({ invalidUrl, canUpdateFrame }: LoadErrorProps) {
  if (invalidUrl) {
    if (canUpdateFrame) {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Oops!! Failed to load</h1>
          <p className="text-gray-500 mt-2">
            Invalid Google Slides URL. Please update the URL to load the content
            in the preview
          </p>
        </div>
      )
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Oops!! Something went wrong</h1>
      <p className="text-gray-500 mt-2">
        Failed to load Google Slides. Please try again later
      </p>
    </div>
  )
}
