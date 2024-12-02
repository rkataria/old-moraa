export type PostfixKeysWith<T extends object, Key extends string> = {
  [K in keyof T as `${string & K}${Key}`]: T[K]
}

export type UserPreferences = {
  meeting: {
    video: boolean
    audio: boolean
  }
  pdf?: {
    [key: string]: {
      position: number
      config: {
        [key: string]: string
      }
    }
  }
}

export enum UserType {
  LEARNER = 'LEARNER',
  EDUCATOR = 'EDUCATOR',
}
