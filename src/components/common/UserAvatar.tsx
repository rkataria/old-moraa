import { Avatar, AvatarProps, User } from '@nextui-org/react'

import { Tooltip, TooltipProps } from './ShortuctTooltip'

export interface IUserProfile {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

interface IUserAvatar {
  profile: IUserProfile
  name?: string
  withName?: boolean
  description?: string
  avatarProps?: AvatarProps
  nameClass?: string
  descriptionClass?: string
  tooltipProps?: TooltipProps
}

export const getProfileName = (profile: IUserProfile) => {
  if (!profile) {
    return 'Moraa User'
  }

  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`
  }

  return 'Moraa User'
}

export const getAvatar = (profile: IUserProfile) => {
  if (!profile) {
    return ''
  }

  if (profile.avatar_url) {
    return profile.avatar_url
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getProfileName(profile))}`
}

export function UserAvatar({
  profile,
  name,
  withName,
  description,
  avatarProps,
  nameClass,
  descriptionClass,
  tooltipProps,
}: IUserAvatar) {
  if (withName) {
    return (
      <Tooltip {...tooltipProps}>
        <User
          name={name || getProfileName(profile)}
          description={description}
          avatarProps={{
            ...avatarProps,
            src: getAvatar(profile),
          }}
          classNames={{ name: nameClass, description: descriptionClass }}
        />
      </Tooltip>
    )
  }

  return <Avatar src={getAvatar(profile)} {...avatarProps} />
}
