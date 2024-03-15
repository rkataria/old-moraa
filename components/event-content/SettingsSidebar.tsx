import { IconX } from '@tabler/icons-react'

import { CommonSlideSettings } from '../common/CommonSlideSettings'
import { PollSlideSettings } from '../common/PollSlideSettings'

import { cn } from '@/utils/utils'

interface ISlideSetting {
  open: boolean
  settingsEnabled: boolean
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface ISettingsWrapper {
  contentClass?: string
  open: boolean
  children: React.ReactNode
  setSettingsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function SettingsWrapper({
  contentClass,
  open,
  children,
  setSettingsSidebarVisible,
}: ISettingsWrapper) {
  return (
    <div
      className={cn(
        'fixed top-0 w-[19rem] bg-white/95 h-full transition-all pt-16 pb-4 border-l bg-white',
        open ? 'right-0' : '-right-80'
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
  open,
  settingsEnabled,
  setSettingsSidebarVisible,
}: ISlideSetting) {
  if (!settingsEnabled) {
    return null
  }

  return (
    <SettingsWrapper
      open={open}
      setSettingsSidebarVisible={setSettingsSidebarVisible}>
      <CommonSlideSettings />
      <PollSlideSettings />
    </SettingsWrapper>
  )
}
