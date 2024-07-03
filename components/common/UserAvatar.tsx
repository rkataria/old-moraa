import { Avatar, AvatarProps, User } from '@nextui-org/react'

export interface IUserProfile {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface IUserAvatar {
  profile: IUserProfile
  withName?: boolean
  description?: string
  avatarProps?: AvatarProps
  nameClass?: string
  descriptionClass?: string
}

export function UserAvatar({
  profile,
  withName,
  description,
  avatarProps,
  nameClass,
  descriptionClass,
}: IUserAvatar) {
  const getProfileName = () => {
    if (!profile) {
      return 'Moraa User'
    }

    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }

    return 'Moraa User'
  }

  const getAvatar = () => {
    if (!profile) {
      return ''
    }

    if (profile.avatar_url) {
      return profile.avatar_url
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getProfileName())}`
  }

  if (withName) {
    return (
      <User
        name={getProfileName()}
        description={description}
        avatarProps={{
          ...avatarProps,
          src: getAvatar(),
        }}
        classNames={{ name: nameClass, description: descriptionClass }}
      />
    )
  }

  return <Avatar src={getAvatar()} {...avatarProps} />
}
