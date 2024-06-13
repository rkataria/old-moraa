export function FrameDescription({ description }: { description: string }) {
  return (
    <h2 className="w-full px-2 border-0 bg-transparent outline-none hover:outline-none focus:ring-0 focus:border-0 text-sm text-slate-600 font-bold">
      {description}
    </h2>
  )
}
