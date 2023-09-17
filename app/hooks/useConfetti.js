import { useEffect, useState } from "react"

function useConfetti(duration = 2000) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setShowConfetti(false)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [showConfetti, duration])

  const triggerConfetti = () => {
    setShowConfetti(true)
  }

  return { showConfetti, triggerConfetti }
}
