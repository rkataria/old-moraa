import AuthButton from "@/components/AuthButton"

export default async function HomePage() {
  return (
    <main className="flex flex-col w-full h-screen justify-center items-center gap-4 bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-5xl font-bold">
        Welcome to <a href="https://learnsight.io">Learnsight</a>
      </h1>

      <p className="text-2xl">
        A collaborative learning tool for live training 😍
      </p>
      <AuthButton />
    </main>
  )
}
