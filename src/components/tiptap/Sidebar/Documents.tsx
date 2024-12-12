/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button } from '@nextui-org/button'
import { motion } from 'framer-motion'
import { IoMdAdd } from 'react-icons/io'
import { IoCloseOutline, IoDocumentText } from 'react-icons/io5'

import { EditableLabel } from '@/components/common/EditableLabel'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { Page } from '@/hooks/useRichText'
import { cn } from '@/utils/utils'

interface IDocuments {
  pages: Page[]
  activePage: string
  addPage: () => void
  handlePageChange: (id: string) => void
  renamePage: (renamedPage: Page) => void
  deletePage: (id: string) => void
}

export function Documents({
  pages,
  activePage,
  addPage,
  handlePageChange,
  renamePage,
  deletePage,
}: IDocuments) {
  return (
    <motion.div
      animate={{
        x: [-100, 0],
      }}
      transition={{
        duration: 0.1,
        ease: 'easeInOut',
      }}
      className="relative overflow-y-auto scrollbar-none h-full p-2 border-1 border-gray-200 rounded-md backdrop-blur-sm bg-black/5">
      <div className="flex items-center justify-between">
        <p className="font-medium ml-3">Pages</p>
        <Button size="sm" variant="light" isIconOnly onClick={addPage}>
          <IoMdAdd size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-1.5 mt-4">
        {pages.map((page, index) => (
          <div
            onClick={() => handlePageChange(page.id)}
            className={cn(
              'relative flex items-center gap-2 justify-start cursor-pointer hover:bg-gray-50 p-3 py-1 rounded-md duration-300 group/doc',
              {
                'bg-gray-50': activePage === page.id,
              }
            )}>
            <IoDocumentText size={24} className="text-black/30" />
            <EditableLabel
              readOnly={false}
              label={page.name || ''}
              onUpdate={(value: string) => {
                renamePage({ id: page.id, name: value })
              }}
            />
            <RenderIf isTrue={index !== 0}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="hidden group-hover/doc:flex p-0 absolute right-0 !bg-gray-50"
                onClick={() => deletePage(page.id)}>
                <IoCloseOutline size={18} />
              </Button>
            </RenderIf>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
