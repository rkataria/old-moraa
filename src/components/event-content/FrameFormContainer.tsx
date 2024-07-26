type FrameFormContainerProps = {
  headerIcon?: React.ReactNode
  headerTitle?: string
  headerDescription?: string
  footerNote?: string
  children: React.ReactNode
}

export function FrameFormContainer({
  headerIcon,
  headerTitle,
  headerDescription,
  footerNote,
  children,
}: FrameFormContainerProps) {
  return (
    <div className="flex justify-center items-center gap-10 w-full h-full mt-4 p-10 rounded-md">
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="flex flex-col justify-center items-center gap-4 pb-8 w-full m-auto">
          {headerIcon}
          <h2 className="subheading-1 text-primary">{headerTitle}</h2>
          <p className="text-center text-foreground">{headerDescription}</p>
        </div>
        {children}
        <p className="text-sm font-[300] text-gray-400 text-center pt-4">
          {footerNote}
        </p>
      </div>
    </div>
  )
}
