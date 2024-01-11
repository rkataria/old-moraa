import Link from "next/link"
import Messages from "./messages"
import { IconBrandGoogle, IconBrandGoogleFilled } from "@tabler/icons-react"

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground flex items-center group text-sm bg-primary hover:bg-primary/80 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>

        <div>
          <form
            className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action="/api/auth/sign-in"
            method="post"
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="Enter your email"
              required
              autoComplete="off"
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="off"
            />
            <button className="rounded-md px-4 py-2 text-foreground mb-2 bg-green-600 hover:bg-green-500">
              Sign In
            </button>
            <button
              formAction="/api/auth/sign-up"
              className="transition-all duration-200 rounded-md px-4 py-2 text-black mb-2 bg-white/80 hover:bg-white"
            >
              Sign Up
            </button>
            <Messages />
          </form>
          <div className="flex justify-center items-center my-8">
            <span className="p-3 flex justify-center items-center bg-white/10 text-gray-500 rounded-full text-sm">
              OR
            </span>
          </div>
          <form
            action="/api/auth/google-signin"
            method="POST"
            className="flex flex-col mt-2"
          >
            <button
              formAction="/api/auth/google-signin"
              className="flex flex-row gap-2 justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 bg-[#DB4437]/80 hover:bg-[#DB4437]"
            >
              <IconBrandGoogleFilled
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
              Sign In with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
