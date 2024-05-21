import { useContext } from 'react'

import { RiUnpinLine } from 'react-icons/ri'
import { RxCross1 } from 'react-icons/rx'

import { Button } from '@nextui-org/react'

import { CommonSlideSettings } from '../common/CommonSlideSettings'
import { MoraaBoardSlideSettings } from '../common/MoraaBoardSlideSettings'
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
    <div className={cn('w-full h-full transition-all border-l bg-[#f5f5f5]')}>
      <div className="flex items-center justify-between w-full p-2">
        <Button
          variant="light"
          isIconOnly
          size="sm"
          onClick={() => setSettingsSidebarVisible(false)}>
          <RxCross1 size={18} />
        </Button>
        <h3 className="text-sm font-medium text-center">Settings</h3>
        <Button
          variant="light"
          isIconOnly
          size="sm"
          disabled
          className="opacity-0 pointer-events-none">
          <RiUnpinLine size={24} />
        </Button>
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
      <MoraaBoardSlideSettings />
    </SettingsWrapper>
  )
}
