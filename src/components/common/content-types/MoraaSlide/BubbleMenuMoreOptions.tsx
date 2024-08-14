import { Button } from '@nextui-org/react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

import { useStudioLayout } from '@/hooks/useStudioLayout'

export function BubbleMenuMoreOptions() {
  const { rightSidebarVisiblity, setRightSidebarVisiblity } = useStudioLayout()

  return (
    <Button
      size="sm"
      variant="light"
      isIconOnly
      radius="md"
      className="h-7 text-sm flex justify-center items-center gap-1 px-1"
      onClick={() => {
        if (rightSidebarVisiblity === 'frame-appearance') {
          setRightSidebarVisiblity(null)

          return
        }

        setRightSidebarVisiblity('frame-appearance')
      }}>
      <BiDotsHorizontalRounded size={16} />
    </Button>
  )
}
