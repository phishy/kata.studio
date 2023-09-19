import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import Link from "next/link"

// import Search from "./Search"

export const revalidate = 0

interface Card {
  id: number
  title: string
  description: string
  difficulty: string
}

interface PageProps {
  params: { id: string }
  searchParams: { q?: string }
}

export default async function Page({ params, searchParams }: PageProps) {
  const supabase = createServerComponentClient({
    cookies,
  })

  // let { error, data } = await supabase.from("lists").select("*, cards_lists(*, cards(*))").limit(100)
  let { error, data } = await supabase.from("lists").select("id,name").limit(100)
  if (error) {
    console.log(error);
  }

  console.log("data", JSON.stringify(data, null, 2))

  return (
    <div className="p-5 md:p-7 bg-black">
      <h1 className="text-white text-xl mb-5">List Library</h1>
      {/* <Search q={searchParams?.q} /> */}
      <div className="grid grid-rows-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((list: any) => (
          <Link
            key={list.id}
            href={`/lists/${list.id}`}
            className="border-2 border-gray-900 hover:border-pink-500 hover:cursor-pointer rounded w-128"
            prefetch={false}
          >
            <div className="w-full p-5">
              <div className="text-white text-xl font-bold mb-2">
                {list.name}
              </div>
              <div className="text-gray-500">{list.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
