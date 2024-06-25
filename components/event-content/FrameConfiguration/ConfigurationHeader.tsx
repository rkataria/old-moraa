export function ConfigurationHeader({
  title,
  icon,
}: {
  title: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex justify-start items-center gap-2">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
  )
}
