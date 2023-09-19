import { Rubik } from "next/font/google"

const rubik = Rubik({ subsets: ["latin"] })

export default function Logo({ size = 4 }: { size?: number }) {
  return (
    <h1 className={`text-${size}xl ${rubik.className}`}>
      <span className="text-purple-500">kata</span>
      <span className="text-white">.studio</span>
    </h1>
  )
}
