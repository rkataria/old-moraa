import React, { useContext } from 'react'

import { IconX } from '@tabler/icons-react'
import { TwitterPicker } from 'react-color'

import { SlideManagerContext } from '@/contexts/SlideManagerContext'
import { ISlide, SlideManagerContextType } from '@/types/slide.type'
import { cn } from '@/utils/utils'

interface ISlideSetting {
  slide: ISlide
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
  slide,
  open,
  settingsEnabled,
  setSettingsSidebarVisible,
}: ISlideSetting) {
  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const updateSlideColors = (color: string, colorKey: string) => {
    updateSlide({
      ...slide,
      config: {
        ...slide.config,
        [colorKey]: color,
      },
    })
  }

  if (!settingsEnabled) {
    return null
  }

  return (
    <SettingsWrapper
      open={open}
      setSettingsSidebarVisible={setSettingsSidebarVisible}>
      <div className="flex items-center gap-2px-4 my-4 text-xs gap-3">
        <div className="flex-1">
          <p className="text-xs text-slate-500 mt-2">Background Color</p>
          <TwitterPicker
            colors={[
              '#FF6900',
              '#FCB900',
              '#7BDCB5',
              '#00D084',
              '#8ED1FC',
              '#0693E3',
              '#ffffff',
              '#EB144C',
              '#F78DA7',
              '#9900EF',
            ]}
            className="!shadow-none mt-2"
            triangle="hide"
            styles={{
              default: {
                body: {
                  padding: '0',
                },
                swatch: {
                  border: '1px solid lightGrey',
                },
              },
            }}
            color={slide.config.backgroundColor}
            onChange={(color) =>
              updateSlideColors(color.hex, 'backgroundColor')
            }
          />
        </div>
      </div>
    </SettingsWrapper>
  )
}
