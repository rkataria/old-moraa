/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cn, Image } from '@nextui-org/react'
import { AiOutlineClose } from 'react-icons/ai'

import { theme, ThemeModal, Themes } from './ThemeModal'
import { RenderIf } from '../common/RenderIf/RenderIf'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

export function ThemePicker({
  disclosure,
  selectedTheme,
  onThemeChange,
}: {
  disclosure: UseDisclosureReturn
  selectedTheme: theme
  onThemeChange: (theme: theme | null) => void
}) {
  return (
    <>
      <div
        className="p-3 bg-default/30 backdrop-blur-xl rounded-lg cursor-pointer flex items-center justify-between"
        onClick={disclosure.onOpen}>
        <div className="flex items-start gap-4 text-gray-400">
          <Image
            width={60}
            src={
              Themes.find((_theme) => _theme.label === selectedTheme?.theme)
                ?.image || '/images/invite/none-theme.png'
            }
            classNames={{ img: 'rounded-sm' }}
          />
          <div className="">
            <p className={cn('text-gray-600 font-medium')}>Page Theme</p>
            <p className={cn('text-sm text-gray-600 mt-1')}>
              {selectedTheme?.theme || 'None'}
            </p>
          </div>
        </div>
        <RenderIf isTrue={!!selectedTheme?.theme}>
          <AiOutlineClose
            size={20}
            className="text-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              onThemeChange(null)
            }}
          />
        </RenderIf>
      </div>

      <ThemeModal disclosure={disclosure} onChange={onThemeChange} />
    </>
  )
}
