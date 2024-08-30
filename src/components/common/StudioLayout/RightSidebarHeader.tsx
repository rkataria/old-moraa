export function RightSidebarHeader({
  title,
  icon,
}: {
  title: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex justify-start items-center gap-2 p-4">
      {icon}
      <h3 className="font-semibold capitalize">{title}</h3>
    </div>
  )
}
