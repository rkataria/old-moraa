export function RightSidebarHeader({
  title,
  icon,
}: {
  title: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex justify-start items-center gap-2 pb-4">
      {icon}
      <h3 className="font-medium capitalize text-black/90">{title}</h3>
    </div>
  )
}
