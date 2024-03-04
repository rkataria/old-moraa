'use client'

import { AuthButton } from '@/components/auth/AuthButton'
import { NamesForm } from '@/components/auth/NamesForm'

export default async function HomePage() {
  return (
    <main className="flex flex-col w-full h-screen justify-center items-center gap-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-5xl font-bold">
        Welcome to <a href="https://app.moraa.co">Moraa</a>
      </h1>

      <p className="text-2xl">
        Creating a ‘wow’ virtual learning experience where learning is
        interactive and results are awesome! 😍
      </p>
      <AuthButton />
      <NamesForm />
    </main>
  )
}
