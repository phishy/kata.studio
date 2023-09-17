import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import Link from "next/link"

// import Search from "./Search"

export const revalidate = 0;

interface Kata {
  id: number
  title: string
  description: string
  difficulty: string
}

interface PageProps {
  searchParams: { q?: string }
}

export default async function Page({ params, searchParams }: PageProps) {
  console.log('sdfdfds', params)
  const supabase = createServerComponentClient({
    headers,
    cookies,
  })
  let res
  if (searchParams.q) {
    res = await supabase
      .from("cards")
      .select("id,title,question")
      // .or(`title.ilike."%${searchParams.q}%",description.ilike."%${searchParams.q}%"`)
      .limit(100)
  } else {
    res = await supabase.from("cards").select("id,title,question").limit(100)
  }

  let { data } = res
  console.log("data", data)

  return (
    <div className="p-5 md:p-7 bg-black">
      <h1 className="text-white text-xl mb-5">Card Library</h1>
      {/* <Search q={searchParams?.q} /> */}
      <div className="grid grid-rows-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((card) => (
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

              <div className="text-white text-xl font-bold mb-2">
                {card.title}
              </div>
              <div className="text-gray-500">{card.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
