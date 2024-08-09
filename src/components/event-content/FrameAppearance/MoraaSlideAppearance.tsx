import { useContext, useEffect, useState } from 'react'

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from '@nextui-org/react'
import { IoCloseOutline } from 'react-icons/io5'

import { MoraaSlideActiveObjectAppearance } from './MoraaSlideActiveObjectAppearance'
import { MoraaSlideTemplates } from '../MoraaSlideConfiguration/MoraaSlideTemplates'

import { BackgroundControlsModal } from '@/components/common/content-types/MoraaSlide/BackgroundControlsModal'
import { LabelWithInlineControl } from '@/components/common/LabelWithInlineControl'
import { EventContext } from '@/contexts/EventContext'
import { useMoraaSlideStore } from '@/stores/moraa-slide.store'
import { EventContextType } from '@/types/event-context.type'
import { loadTemplate } from '@/utils/canvas-templates'

export function MoraaSlideAppearance() {
  const [open, setOpen] = useState(false)
  const { currentFrame } = useContext(EventContext) as EventContextType
  const { templateKey } = useMoraaSlideStore((state) => state)
  const canvas = useMoraaSlideStore(
    (state) => state.canvasInstances[currentFrame?.id as string]
  )

  useEffect(() => {
    if (!templateKey) return

    loadTemplate(canvas, templateKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey])

  if (!currentFrame || !canvas) return null

  const activeObject = canvas.getActiveObject()

  if (activeObject) {
    return <MoraaSlideActiveObjectAppearance />
  }

  return (
    <>
      <LabelWithInlineControl
        label="Background"
        className="flex justify-between items-center gap-2"
        control={<BackgroundControlsModal onClose={() => {}} />}
      />
      <LabelWithInlineControl
        label="Layout"
        className="flex flex-col gap-2"
        control={
          <Popover
            isOpen={open}
            onOpenChange={setOpen}
            showArrow
            offset={10}
            placement="left">
            <PopoverTrigger>
              <Button variant="flat" size="sm" fullWidth>
                Choose Template
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 justify-start items-start overflow-hidden w-[520px] h-[420px]">
              <div className="w-full bg-black text-white p-2 flex justify-between items-center">
                <h2>Apply template</h2>
                <Button
                  size="sm"
                  radius="full"
                  isIconOnly
                  variant="light"
                  className="text-white"
                  onClick={() => setOpen(false)}>
                  <IoCloseOutline size={22} />
                </Button>
              </div>
              <Tabs
                aria-label="templates"
                color="primary"
                variant="underlined"
                fullWidth
                classNames={{
                  tabList:
                    'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                  cursor: 'w-full bg-[#22d3ee]',
                  tab: 'max-w-fit px-0 h-12',
                  tabContent: 'group-data-[selected=true]:text-[#06b6d4]',
                  panel: 'w-full h-full',
                }}>
                <Tab
                  key="popular"
                  className="p-0"
                  title={
                    <div className="flex items-center space-x-2 px-2">
                      <span>Popular</span>
                    </div>
                  }>
                  <MoraaSlideTemplates />
                </Tab>
                <Tab
                  key="premium"
                  className="p-0"
                  title={
                    <div className="flex items-center space-x-2 px-2">
                      <span>Premium</span>
                    </div>
                  }>
                  <div className="flex justify-center items-center bg-gray-100 w-full h-full flex-none">
                    Comming soon
                  </div>
                </Tab>
              </Tabs>
            </PopoverContent>
          </Popover>
        }
      />
    </>
  )
}
