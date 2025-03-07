import { MoraaSlideActiveObjectAppearance } from './MoraaSlideActiveObjectAppearance'

import { MoraaSlideBackgroundControls } from '@/components/frames/frame-types/MoraaSlide/BackgroundControls'
import { useMoraaSlideEditorContext } from '@/contexts/MoraaSlideEditorContext'

export function MoraaSlideAppearance() {
  // const [open, setOpen] = useState(false)
  const { canvas } = useMoraaSlideEditorContext()

  if (!canvas) return null

  const activeObject = canvas.getActiveObject()

  if (activeObject) {
    return <MoraaSlideActiveObjectAppearance />
  }

  return (
    <>
      {/* <LabelWithInlineControl
        label="Layout"
        className="flex flex-col gap-2 font-semibold"
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
                  cursor: 'w-full bg-primary',
                  tab: 'max-w-fit px-0 h-12',
                  tabContent: 'group-data-[selected=true]:text-primary',
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
      /> */}
      <MoraaSlideBackgroundControls />
    </>
  )
}
