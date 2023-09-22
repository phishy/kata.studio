import { ImageResponse } from "next/server"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// export const runtime = "edge"

export const alt = "kata.studio"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image(props) {

  const supabase = createServerComponentClient({ cookies })
  const res = await supabase
    .from("cards")
    .select("*")
    .eq("id", props.params.id)
    .single()
  console.log(res)

  // Font
  // const interSemiBold = fetch(
  //   new URL('./Inter-SemiBold.ttf', import.meta.url)
  // ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="bg-gray-50 flex w-full">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span>{res.data.title}</span>
              <span tw="text-indigo-600">Learn JavaScript @ kata.studio</span>
            </h2>
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">
                  Answer Now
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      // fonts: [
      //   {
      //     name: 'Inter',
      //     data: await interSemiBold,
      //     style: 'normal',
      //     weight: 400,
      //   },
      // ],
    }
  )
}
