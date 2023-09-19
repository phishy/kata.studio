// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import SelectPlaylist from "@/components/SelectPlaylist"

export const dynamic = "force-dynamic"

export default async function ServerComponent(props) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerComponentClient({ cookies })

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  const { data: lists } = await supabase
    .from("lists")
    .select("*, cards_lists(*, cards(*))")

  return (
    <div>
      <pre>{JSON.stringify(lists, null, 2)}</pre>
      <SelectPlaylist card_id={props.params.id} />
    </div>
  )
}
