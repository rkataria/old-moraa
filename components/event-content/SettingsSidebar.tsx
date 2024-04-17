import { useContext } from 'react'

import { IconX } from '@tabler/icons-react'

import { CommonSlideSettings } from '../common/CommonSlideSettings'
import { PollSlideSettings } from '../common/PollSlideSettings'
import { ReflectionSlideSettings } from '../common/ReflectionSlideSettings'
import { TextImageSlideSettings } from '../common/TextImageSlideSettings'

import { EventContext } from '@/contexts/EventContext'
import { EventContextType } from '@/types/event-context.type'
import { cn } from '@/utils/utils'

interface ISlideSetting {
  settingsEnabled: boolean
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface ISettingsWrapper {
  contentClass?: string
  children: React.ReactNode
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function SettingsWrapper({
  contentClass,
  children,
  setSettingsSidebarVisible,
}: ISettingsWrapper) {
  return (
    <div
      className={cn(
        'w-full bg-white/95 h-full transition-all pb-4 border-l bg-white'
      )}>
      <div className="flex items-center justify-between font-semibold w-full bg-slate-100 py-2 px-4">
        <p className="text-xs">Settings</p>
        <IconX
          onClick={() => setSettingsSidebarVisible(false)}
          className="cursor-pointer"
        />
      </div>

      <div className={cn(contentClass, 'px-4')}>{children}</div>
    </div>
  )
}

export function SettingsSidebar({
  settingsEnabled,
  setSettingsSidebarVisible,
}: ISlideSetting) {
  const { preview } = useContext(EventContext) as EventContextType

  if (!settingsEnabled || preview) {
    return null
  }

  return (
    <SettingsWrapper setSettingsSidebarVisible={setSettingsSidebarVisible}>
      <CommonSlideSettings />
      <PollSlideSettings />
      <ReflectionSlideSettings />
      <TextImageSlideSettings />
    </SettingsWrapper>
  )
}
