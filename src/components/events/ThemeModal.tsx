/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalBody,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react'

import { ColorPicker } from '../common/ColorPicker'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import type { UseDisclosureReturn } from '@nextui-org/use-disclosure'

import { cn } from '@/utils/utils'

const quantumns = [
  {
    label: 'Summer',
    colors: [
      '#FFF9C4', // Light Sunshine Yellow
      '#FF8A80', // Light Coral Pink
      '#B3E5FC', // Light Sky Blue
      '#FFEBEE', // Light Pink (new)
    ],
  },
  {
    label: 'Melon',
    colors: [
      '#FBD5C1', // Light Cantaloupe
      '#E6F7D2', // Light Honeydew
      '#FF9AA2', // Light Watermelon Pink
      '#FCE5CD', // Light Apricot (new)
    ],
  },
  {
    label: 'Barbie',
    colors: [
      '#FF80AB', // Lighter Hot Pink
      '#FFCCCB', // Lighter Bubblegum Pink
      '#FF66B2', // Lighter Fuchsia
      '#F3A9B6', // Light Blush Pink (new)
    ],
  },
  {
    label: 'Sunset',
    colors: [
      '#FFB74D', // Lighter Tangerine
      '#FF8A80', // Lighter Sunset Orange
      '#F3B8B1', // Lighter Dusky Pink
      '#FFE0B2', // Light Cream (new)
    ],
  },
  {
    label: 'Ocean',
    colors: [
      '#80E0D0', // Lighter Turquoise
      '#4CAF50', // Lighter Seafoam Green
      '#003D79', // Lighter Deep Navy
      '#B2DFDB', // Light Mint (new)
    ],
  },
  {
    label: 'Forest',
    colors: [
      '#B4B4A6', // Lighter Moss Green
      '#3B9A8D', // Lighter Pine Green
      '#6D8F6A', // Lighter Olive Green
      '#C5E1A5', // Light Lime Green (new)
    ],
  },
  {
    label: 'Lavender',
    colors: [
      '#F6E9F1', // Lighter Lavender Blush
      '#EAE6F0', // Lighter Misty Lavender
      '#D6C8E0', // Lighter Heather
      '#F3E5F5', // Light Lilac (new)
    ],
  },
]

const Emojis = [
  'heart',
  '+1',
  'tada',
  'clap',
  'joy',
  'open_mouth',
  'disappointed_relieved',
  'thinking_face',
  '-1',
  'cocktail',
  'computer',
]

const Colors = [
  '#FFB6C1',
  '#B0E0E6',
  '#E6E6FA',
  '#FFDAB9',
  '#F5FFFA',
  '#AFEEEE',
  '#FAFAD2',
  '#89CFF0',
  '#FFEBCD',
  '#F0FFF0',
]

export const Themes = [
  {
    label: 'Minimial',
    image: '/images/invite/minimial-template.png',
    haveColor: true,
  },
  {
    label: 'Quantum',
    image: '/images/invite/quantum-template.png',
    haveColor: false,

    items: quantumns,
  },
  {
    label: 'Emoji',
    image: '/images/invite/emoji-template.png',
    haveColor: true,
    items: Emojis,
  },
  // {
  //   label: 'Pattern',
  //   image: '/images/invite/pattern-template.png',
  //   items: ['Cross', 'Hypnotic', 'Plus', 'Polkadot', 'Wave', 'Zigzag'],
  //   haveColor: true,
  // },
  //   {
  //     label: 'Confetti',
  //     image: '/images/invite/confetti-template.png',
  //   },
]

export interface theme {
  theme: string
  color?: string
  colors?: string | { label: string; colors: string[] }
}

export function ThemeModal({
  disclosure,
  onChange,
}: {
  disclosure: UseDisclosureReturn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (theme: any) => void
}) {
  const [selectedTheme, setSelectedTheme] = useState<theme | undefined>()

  if (!disclosure.isOpen) return null

  const handleColorChange = (changedColor: string) => {
    const updatedTheme = { ...(selectedTheme as theme) }
    updatedTheme.color = changedColor
    onChange(updatedTheme)
    setSelectedTheme(updatedTheme)
  }

  const handleChageTheme = (_selectedTheme: { label: string }) => {
    const newTheme: theme = { theme: _selectedTheme.label }
    switch (_selectedTheme.label) {
      case 'Minimial':
        newTheme.theme = _selectedTheme.label
        // eslint-disable-next-line prefer-destructuring
        newTheme.color = Colors[0]
        break

      case 'Quantum':
        newTheme.theme = _selectedTheme.label
        // eslint-disable-next-line prefer-destructuring
        newTheme.colors = quantumns[0]

        break

      case 'Emoji':
        newTheme.theme = _selectedTheme.label
        // eslint-disable-next-line prefer-destructuring
        newTheme.colors = Emojis[0]

        break

      default:
        console.log('default')
    }
    setSelectedTheme(newTheme)
    onChange(newTheme)
  }
  console.log(selectedTheme)

  const handleItemchange = (
    selectedItem: string | { label: string; colors: string[] }
  ) => {
    const updatedTheme = { ...(selectedTheme as theme) }
    updatedTheme.colors = selectedItem

    onChange(updatedTheme)
    setSelectedTheme(updatedTheme)
  }

  return (
    <Modal
      size="lg"
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      disableAnimation
      className="w-full shadow-2xl max-w-[auto] !m-0 backdrop-blur-lg bg-white/30"
      classNames={{
        wrapper: 'place-items-end !items-end scrollbar-none duration-300',
      }}
      backdrop="transparent">
      <ModalContent>
        {() => (
          <ModalBody className="mt-4 mb-4 ">
            <div className="flex items-center gap-4 text-center justify-center">
              {Themes.map((theme) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div onClick={() => handleChageTheme(theme)}>
                  <Image
                    src={theme.image}
                    width={100}
                    className={cn('border-1 p-0.5', {
                      ' border-primary-500':
                        selectedTheme?.theme === theme.label,
                    })}
                  />
                  <p className="text-gray-400 mt-3">{theme.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <RenderIf
                isTrue={
                  !!Themes.find((theme) => theme.label === selectedTheme?.theme)
                    ?.haveColor
                }>
                <Popover placement="top" showArrow>
                  <PopoverTrigger>
                    <Button size="md" className="bg-default-100 px-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      Select Color
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 flex items-center gap-4">
                      {Colors.map((color) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                          style={{ background: color }}
                          className={cn(
                            'w-8 h-8 cursor-pointer border-2 rounded-lg',
                            {
                              'border-primary-300':
                                selectedTheme?.color === color,
                            }
                          )}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}

                      <ColorPicker
                        defaultColor={selectedTheme?.color}
                        onchange={handleColorChange}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </RenderIf>
              <RenderIf
                isTrue={
                  !!Themes.find((theme) => theme.label === selectedTheme?.theme)
                    ?.items
                }>
                <Popover placement="top" showArrow>
                  <PopoverTrigger>
                    <Button size="md" className="bg-default-100 px-4">
                      Change {selectedTheme?.theme}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 flex gap-6">
                      {Themes.find(
                        (theme) => theme.label === selectedTheme?.theme
                      )?.items?.map((item) => {
                        if (selectedTheme?.theme === 'Emoji') {
                          return (
                            <Button
                              variant="light"
                              isIconOnly
                              onClick={() => handleItemchange(item)}
                              className={cn(
                                'border border-transparent rounded-full w-[40px] h-[40px]',
                                {
                                  'bg-primary': selectedTheme.colors === item,
                                }
                              )}>
                              <em-emoji
                                set="apple"
                                id={item as string}
                                size={25}
                              />
                            </Button>
                          )
                        }

                        if (selectedTheme?.theme === 'Quantum') {
                          const selectedQuantumLabel = (
                            selectedTheme.colors as {
                              label: string
                              colors: string[]
                            }
                          ).label
                          const quantum = item as {
                            label: string
                            colors: string[]
                          }

                          return (
                            <div className="text-center">
                              <div
                                onClick={() => handleItemchange(item)}
                                style={{
                                  background: `linear-gradient(to right,${quantum.colors[0]},${quantum.colors[1]},${quantum.colors[2]},${quantum.colors[3]})`,
                                }}
                                className={cn(
                                  'border-2 w-10 h-10 bg-red-500 rounded-full',
                                  {
                                    'border-primary':
                                      selectedQuantumLabel === quantum.label,
                                  }
                                )}
                              />
                              <p className="mt-4 text-xs text-gray-400">
                                {quantum.label}
                              </p>
                            </div>
                          )
                        }

                        return null
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </RenderIf>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
