/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { BiSolidImage, BiSolidVideos } from 'react-icons/bi'
import { FaPhotoVideo, FaUnsplash } from 'react-icons/fa'
import { SiGiphy, SiIcons8 } from 'react-icons/si'
import { Orientation } from 'unsplash-js'

import { MediaProviderContent, MediaProviderType } from './MediaProviderContent'
import { SideMenuItem } from './SideMenuItem'
import { Tooltip } from '../ShortuctTooltip'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/utils'

const MENU_OPTIONS = {
  library: [
    {
      icon: <BiSolidImage size={18} className="text-secondary-400" />,
      label: 'Images',
      allowCrop: true,
    },
    {
      icon: <BiSolidVideos size={18} className="text-secondary-200" />,
      label: 'Videos',
      disabled: true,
      allowCrop: false,
    },
  ],
  integrations: [
    {
      icon: <FaUnsplash size={18} className="text-black" />,
      label: MediaProviderType.UNSPLASH,
      allowCrop: false,
    },
    {
      icon: <SiIcons8 size={18} className="text-green-500" />,
      label: MediaProviderType.ICON8,
      disabled: true,
      allowCrop: false,
    },
    {
      icon: <SiGiphy size={18} className="text-green-500" />,
      label: MediaProviderType.GIPHY,
      disabled: false,
      allowCrop: false,
    },
  ],
}

type MediaPickerProps = {
  hideLabel?: boolean
  small?: boolean
  ImageOrientation?: Orientation
  trigger?: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  crop?: boolean
  onSelect?: (file: File) => void
  onSelectCallback?: (imageElment: HTMLImageElement) => void
}

export function MediaPicker({
  hideLabel,
  small,
  ImageOrientation,
  trigger,
  placement = 'bottom',
  crop = false,
  onSelect,
  onSelectCallback,
}: MediaPickerProps) {
  const localFileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [provider, setProvider] = useState<MediaProviderType>(
    MediaProviderType.UNSPLASH
  )
  const [fileType, setFileType] = useState<'images' | 'videos'>('images')

  return (
    <Popover
      placement={placement}
      offset={18}
      showArrow
      isOpen={open}
      onOpenChange={setOpen}>
      <PopoverTrigger>
        {trigger || (
          <Button
            variant="light"
            size={small ? 'sm' : 'lg'}
            isIconOnly
            className={cn('flex flex-col justify-center items-center gap-1', {
              'bg-primary text-white hover:bg-primary hover:text-white': open,
            })}>
            <Tooltip
              content="Media"
              placement="top"
              className="block"
              offset={14}>
              <div className="flex flex-col gap-1 justify-center items-center">
                <FaPhotoVideo size={18} />
                {!hideLabel && <span className="text-xs mt-1">Media</span>}
              </div>
            </Tooltip>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="relative w-[672px] rounded-md p-0">
        <div className="h-96 flex justify-start items-stretch w-full">
          <div className="min-w-48 h-full border-r-2 p-4 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm text-gray-400 p-2">
                  Add from library
                </span>
                <ul className="flex flex-col gap-1 mt-2">
                  {MENU_OPTIONS.library.map((option) => (
                    <SideMenuItem
                      key={option.label}
                      icon={option.icon}
                      label={option.label}
                      active={
                        provider === MediaProviderType.LIBRARY &&
                        fileType === option.label.toLowerCase()
                      }
                      disabled={option.disabled}
                      onClick={() => {
                        setProvider(MediaProviderType.LIBRARY)
                        setFileType(
                          option.label.toLowerCase() as 'images' | 'videos'
                        )
                      }}
                    />
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sm text-gray-400 p-2">Integrations</span>
                <ul className="flex flex-col gap-1 mt-2">
                  {MENU_OPTIONS.integrations.map((option) => (
                    <SideMenuItem
                      key={option.label}
                      icon={option.icon}
                      label={option.label}
                      active={provider === option.label}
                      disabled={option.disabled}
                      onClick={() => {
                        setProvider(option.label as MediaProviderType)
                      }}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <label htmlFor="upload">
                <input
                  ref={localFileInputRef}
                  type="file"
                  id="upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setOpen(false)
                      onSelect?.(file)
                    }
                  }}
                />
                <Button
                  size="sm"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    localFileInputRef.current?.click()
                  }}>
                  Upload media
                </Button>
              </label>
            </div>
          </div>
          <div className="h-full p-4 flex-auto">
            <MediaProviderContent
              key={provider}
              ImageOrientation={ImageOrientation}
              provider={provider}
              fileType={fileType}
              crop={crop && provider !== MediaProviderType.GIPHY}
              onSelectCallback={(imageElment) => {
                onSelectCallback?.(imageElment)
                setOpen(false)
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
