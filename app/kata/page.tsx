import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import Link from "next/link"

import Search from "./Search"

export const revalidate = 1

interface Kata {
  id: number;
  title: string;
  description: string;
  difficulty: string;
}

interface PageProps {
  searchParams: { q?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const supabase = createServerComponentClient({
    headers,
    cookies,
  })
  let res
  if (searchParams.q) {
    res = await supabase
      .from("katas_random")
      .select("id,title,description,difficulty")
      .or(`title.ilike."%${searchParams.q}%",description.ilike."%${searchParams.q}%"`)
      .limit(100)
  } else {
    res = await supabase
      .from("katas_random")
      .select("id,title,description,difficulty")
      .limit(100)
  }

  let { data } = res

  return (
    <div className="p-5 md:p-7 bg-black">
      <h1 className="text-xl mb-5">Library</h1>
      <Search q={searchParams?.q} />
      <div className="grid grid-rows-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((kata) => (
          <Link
            key={kata.id}
            href={`/kata/${kata.id}`}
            className="border-2 border-gray-900 hover:border-pink-500 hover:cursor-pointer rounded w-128"
            prefetch={false}
          >
            <div className="w-full p-5">
              <span className="mb-2 inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
                {kata.difficulty}
              </span>

              <div className="text-white text-xl font-bold mb-2">{kata.title}</div>
              <div className="text-gray-500">{kata.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
