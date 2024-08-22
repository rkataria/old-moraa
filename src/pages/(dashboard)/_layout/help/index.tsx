import { Button, Kbd } from '@nextui-org/react'
import { createFileRoute } from '@tanstack/react-router'

import { KeyboardShortcutsModal } from '@/components/common/KeyboardShortcutsModal'

export const Route = createFileRoute('/(dashboard)/_layout/help/')({
  component: () => <TemplatesPage />,
})

function TemplatesPage() {
  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-primary to-[#e9e9d2] p-10 pb-0">
        <p className="text-4xl font-bold text-white">Moraa Support</p>
        <p className="text-white mt-1 mb-14">
          Welcome to Moraa! Nice to see you here. Let’s get started!
        </p>
        <div className="">
          <Button className="bg-white rounded-b-[0px] font-medium" size="md">
            Using Moraa
          </Button>
        </div>
      </div>
      <div className="mt-12 max-w-[60rem]">
        <p className="text-3xl font-semibold">Moraa keyboard shortcuts</p>
        <p className="mt-4 text-md font-medium">
          Navigate Moraa effortlessly with our keyboard shortcuts. Press
          <Kbd keys={['command']} className="mx-1" />{' '}
          <Kbd className="mx-1">/</Kbd>
          to see the shortcuts. For the full list, keep reading.
        </p>
        <div className="mt-6">
          <KeyboardShortcutsModal withoutModal />
        </div>
      </div>
    </>
  )
}
