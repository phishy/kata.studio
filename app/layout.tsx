import App from "@/components/App"
import Logo from "@/components/Logo"
import Link from "next/link"

import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "kata.studio",
  description: "Level up your programming skills",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full`}>
          <header className="flex items-center justify-between py-4 px-6 bg-gray-900 text-white">
            <div className="flex items-center">
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <div className="space-x-4">
              <Link
                href="/kata"
                className="rounded-md bg-indigo-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                prefetch={false}
              >
                Library
              </Link>
              <Link
                href="/cards"
                className="rounded-md bg-indigo-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                prefetch={false}
              >
                Cards
              </Link>
              <Link
                href="/cards/new"
                className="rounded-md bg-indigo-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                prefetch={false}
              >
                New Card
              </Link>
              {/* <Link
                href="/reference"
                className="rounded-md bg-indigo-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                JS Reference
              </Link> */}
              {/* <Login /> */}
            </div>
          </header>
          <App>{children}</App>
      </body>
    </html>
  )
}
