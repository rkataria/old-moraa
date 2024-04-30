export function SlideTitle({
  title,
  textColor,
}: {
  title: string
  textColor: string
}) {
  return (
    <h2
      className="w-full p-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-3xl font-bold"
      style={{ color: textColor }}>
      {title}
    </h2>
  )
}
