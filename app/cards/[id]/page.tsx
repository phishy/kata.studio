import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import Answer from "./answer"

export const revalidate = 60

interface PageProps {
  params: {
    id: string
  }
}

export default async function CardForm({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies })
  let { error, data } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single()

    return <Answer card={data} />

}
