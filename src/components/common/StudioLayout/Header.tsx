export const HEADER_HEIGHT = 56

export function Header({ children }: { children: React.ReactNode }) {
  return <div className="flex-none h-14 w-full bg-white">{children}</div>
}
