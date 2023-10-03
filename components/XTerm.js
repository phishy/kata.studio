import React, { useEffect, useRef, forwardRef } from "react"
import "xterm/css/xterm.css"

const XTermComponent = forwardRef((props, ref) => {
  const terminalRef = useRef(null)

  useEffect(() => {
    const initTerminal = async () => {
      const { Terminal } = await import("xterm")
      const terminal = new Terminal({
        convertEol: true,
      })

      terminal.open(terminalRef.current)

      // Add event listeners or perform any other initialization here

      if (ref) {
        // Forward the reference to the parent component
        if (typeof ref === "function") {
          ref(terminal)
        } else {
          ref.current = terminal
        }
      }
    }
    initTerminal()

    return () => {
      ref.current?.dispose()
    }
  }, [ref])

  return <div ref={terminalRef} />
})

export default XTermComponent
