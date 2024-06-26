// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProfileName = (profile: any) => {
  if (profile?.first_name && profile?.last_name) {
    return `${profile.first_name} ${profile.last_name}`
  }

  return null
}
