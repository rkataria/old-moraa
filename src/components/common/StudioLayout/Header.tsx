export const HEADER_HEIGHT = 56

export function Header({ children }: { children: React.ReactNode }) {
  return <div className="flex-none h-12 w-full">{children}</div>
}
