export function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-auto bg-gray-100 p-4 relative flex justify-center items-start">
      <div className="h-full aspect-video bg-white rounded-md relative group">
        {children}
      </div>
    </div>
  )
}
