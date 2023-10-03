import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import Link from "next/link"

import Search from "@/components/Search"

import Filter from "@/components/ui/Filter"

export const revalidate = 0

interface Card {
  id: number
  title: string
  description: string
  difficulty: string
}

interface PageProps {
  params: { id: string }
  searchParams: { q?: string, difficulty?: string}
}

export default async function Page({ params, searchParams }: PageProps) {
  const supabase = createServerComponentClient({
    cookies,
  })
  let res: any
  let query = supabase.from("cards_random").select("id,title,difficulty,question").limit(100)

  if (searchParams.q) {
    query.or(
      `title.ilike."%${searchParams.q}%",question.ilike."%${searchParams.q}%",answer.ilike."%${searchParams.q}%"`
    )
  } 
  
  if (searchParams.difficulty) {
    query.in("difficulty", [searchParams.difficulty])

  }

  res = await query;

  let { data } = res

  return (
    <div className="p-5 md:p-7 bg-black">
      <h1 className="text-white text-xl mb-5">Card Library</h1>
      <div className="flex space-x-4">
      <Search type="cards" q={searchParams?.q} />
      <Filter />
    </div>
      <div className="grid grid-rows-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((card: any) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="border-2 border-gray-900 hover:border-pink-500 hover:cursor-pointer rounded w-128"
            prefetch={false}
          >
            <div className="w-full p-5">
              {card.difficulty && (
                <span className="mb-2 inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
                  {card.difficulty}
                </span>
              )}

              <div className="text-white mb-2">{card.title}</div>
              {/* <div className="text-gray-500">{card.description}</div> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
