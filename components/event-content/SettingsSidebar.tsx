import { useContext } from 'react'

import { RiUnpinLine } from 'react-icons/ri'
import { RxCross1 } from 'react-icons/rx'

import { Button } from '@nextui-org/react'

import { PDFSlideSettings } from './PDFSlideSettings'
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
  onClose: () => void
}

interface ISettingsWrapper {
  contentClass?: string
  children: React.ReactNode
  onClose: () => void
}

function SettingsWrapper({
  contentClass,
  children,
  onClose,
}: ISettingsWrapper) {
  return (
    <div className={cn('w-full h-full')}>
      <div className="flex items-center justify-between w-full p-2">
        <Button variant="light" isIconOnly size="sm" onClick={onClose}>
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

export function SettingsSidebar({ settingsEnabled, onClose }: ISlideSetting) {
  const { preview } = useContext(EventContext) as EventContextType

  if (!settingsEnabled || preview) {
    return null
  }

  return (
    <SettingsWrapper onClose={onClose}>
      <CommonSlideSettings />
      <PollSlideSettings />
      <ReflectionSlideSettings />
      <PDFSlideSettings />
      <TextImageSlideSettings />
      <MoraaBoardSlideSettings />
    </SettingsWrapper>
  )
}
