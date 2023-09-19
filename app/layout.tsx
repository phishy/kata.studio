import "./globals.css"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "kata.studio",
  description: "Level up your programming skills",
}

import SubLayout from "./sublayout"

export default async function Layout(props) {
  const supabase = createServerComponentClient({ cookies })

  let res = await supabase.auth.getSession()
  console.log(res)

  return <SubLayout {...props} session={res.data.session} />
}
