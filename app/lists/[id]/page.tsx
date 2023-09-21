import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

const revalidate = 0

export default async function List(props) {
  const supabase = createServerComponentClient({ cookies })

  let { error, data } = await supabase
    .from("lists")
    .select("*, cards_lists(*, cards(*))")
    .eq("id", props.params.id)
    .single()

  return (
    <div className="m-5">
      <div className="text-3xl text-white mb-5">{data.name}</div>

      <div className="grid grid-rows-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.cards_lists.map((list: any) => (
          <Link
            key={list.cards.id}
            href={`/cards/${list.cards.id}`}
            className="border-2 border-gray-900 hover:border-pink-500 hover:cursor-pointer rounded w-128"
            prefetch={false}
          >
            <div className="w-full p-5">
              <div className="text-white text-xl font-bold mb-2">
                {list.cards.title}
              </div>
              <div className="text-gray-500">{list.cards.question}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
