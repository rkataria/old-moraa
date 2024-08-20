// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withPermissionCheck(func: any, permitted: boolean) {
  if (permitted) {
    return func
  }

  return () => 'permission denied'
}
