"use client"

import React, { useState, useEffect, ReactNode } from "react"
import WebContainerContext from "@/components/WebContainerContext"
import { WebContainer, FileSystemTree } from "@webcontainer/api"
import Loader from "./components/Loader"
import posthog from "posthog-js"

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { isWebContainerSupported } from "./src/utils"

interface AppProps {
  children: ReactNode
}

const queryClient = new QueryClient()

function App({ children }: AppProps) {
  const [webContainer, setWebContainer] = useState<any>(null)
  const [webContainerReady, setWebContainerReady] = useState<boolean>(false)

  useEffect(() => {
    async function setupWebcontainer() {
      window.location.hostname !== "localhost" &&
        posthog.init("phc_XglXnK8XMeXJMAOKFx6UDBbcoaW2xAD235pRX8rWWlf", {
          api_host: "https://app.posthog.com",
        })

      // if (!isWebContainerSupported()) {
      //   return
      // }

      const files: FileSystemTree = {
        "package.json": {
          file: {
            contents: `
        {
          "name": "codekata",
          "version": "0.1.0",
          "private": true,
          "scripts": {
            "test": "jest",
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
          },
          "dependencies": {
            "jest-cli": "29.5.0",
            "jest": "29.5.0"
          }
        }
        `,
          },
        },
      }

      try {
        const webcontainerInstance = await WebContainer.boot()
        console.info("Webcontainer booted")

        await webcontainerInstance.mount(files)
        console.info("Webcontainer mounted")

        const installProcess = await webcontainerInstance.spawn("npm", [
          "install",
        ])

        let exit = await installProcess.exit
        console.info("Webcontainer exited with code", exit)

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data + "\r\n")
            },
          })
        )
        setWebContainer(webcontainerInstance)
        setWebContainerReady(true)
      } catch (e) {
        setWebContainer(window.webContainer)
        setWebContainerReady(true)
      }
    }
    setupWebcontainer()
  }, [])

  // if (!isWebContainerSupported()) {
  //   return (
  //     <div className="flex items-center h-screen">
  //       <div className="mx-auto">Your browser is not supported.</div>
  //     </div>
  //   )
  // }

  // if (true) {
  // if (!webContainer) {
  //   return <Loader />
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <WebContainerContext.Provider value={{ webContainer, webContainerReady }}>
        {children}
      </WebContainerContext.Provider>
    </QueryClientProvider>
  )
}

export default App
