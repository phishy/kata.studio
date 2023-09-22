import { Metadata, ResolvingMetadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import Answer from "./answer"

export const revalidate = 60

interface PageProps {
  params: {
    id: string
  }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  let { error, data: card } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single()

  return {
    title: `${card.title} - kata.studio`,
    description: `${card.question}`
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
