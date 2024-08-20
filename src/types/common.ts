export type PostfixKeysWith<T extends object, Key extends string> = {
  [K in keyof T as `${string & K}${Key}`]: T[K]
}
