import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function extractCodeBlock(content) {
  const matches = content.match(/```(?:\w+)?\s*([\s\S]*?)```/g)

  if (matches && matches.length > 0) {
    // Remove the backticks and optional language indicator from the first match
    return matches[0].replace(/```(?:\w+)?\s*([\s\S]*?)```/, "$1")
  }

  // Return an empty string if no code block is found
  return ""
}
