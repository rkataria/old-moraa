import { AiOutlineExclamationCircle } from 'react-icons/ai'

import { EmptyPlaceholder } from '@/components/common/EmptyPlaceholder'

type LoadErrorProps = {
  invalidUrl: boolean
  canUpdateFrame: boolean
}

export function LoadError({ invalidUrl, canUpdateFrame }: LoadErrorProps) {
  if (invalidUrl) {
    if (canUpdateFrame) {
      return (
        <EmptyPlaceholder
          icon={
            <AiOutlineExclamationCircle className="w-[60px] h-[60px] text-red-500" />
          }
          title="Failed to Load PDF"
          description="We encountered an issue while trying to load the PDF. Please update the URL to load the content in the preview"
        />
      )
    }
  }

  return (
    <EmptyPlaceholder
      icon={
        <AiOutlineExclamationCircle className="w-[60px] h-[60px] text-red-500" />
      }
      title="Failed to Load PDF"
      description="We encountered an issue while trying to load the PDF. Please try again..."
    />
  )
}
