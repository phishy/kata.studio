"use client"

import { useRouter } from "next/navigation"

export default function Search({ q }) {
  const router = useRouter()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const q = e.target.q.value
    router.push(`/kata?q=${q}`)
  }

  return (
    <form className="w-full flex gap-2 mb-5" onSubmit={handleSubmit}>
      <label htmlFor="email-address" className="sr-only">
        Kata description
      </label>
      <input
        name="q"
        type="text"
        defaultValue={q}
        className="w-full min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
        placeholder="Search"
        onChange={(e) => {
          console.log(e.target.value)
        }}
      />
      <button
        type="submit"
        className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Search
      </button>
    </form>
  )
}
