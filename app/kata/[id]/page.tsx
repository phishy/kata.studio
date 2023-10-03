"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import WebContainerContext from "@/components/WebContainerContext"
import Editor from "@monaco-editor/react"
import XTerm from "@/components/XTerm"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"
// import { useSupabase } from "../../supabase-provider"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  // const { supabase } = useSupabase()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { webContainer, webContainerReady } = useContext(WebContainerContext)
  const { width, height } = useWindowSize()
  const params = useParams()
  const editorRef = useRef(null)
  const xtermRef = useRef(null)

  const [showConfetti, setShowConfetti] = useState(false)
  const [kata, setKata] = useState(null)
  const [activeTab, setActiveTab] = useState("code")
  const [reloadCode, setReloadCode] = useState(0)
  const [code, setCode] = useState<string>()
  const [myCode, setMyCode] = useState<string>()
  const [testCode, setTestCode] = useState<string>()

  useEffect(() => {
    async function fetchKata() {
      console.info("Fetching kata")
      let result

      if (params.id) {
        xtermRef.current?.clear()
        doSearch(null, params.id)
      } else {
        result = {
          title: "Sum Numbers",
          description:
            "Create a function that takes two numbers and returns their sum.",
          difficulty: "easy",
          code: [
            {
              filename: "index.js",
              content:
                "function sum(a, b) {\n  // Your code here\n}\n\nmodule.exports = sum;",
            },
            {
              filename: "index.solution.js",
              content:
                "function sum(a, b) {\n  return a+b\n}\n\nmodule.exports = sum;",
            },
            {
              filename: "index.test.js",
              content:
                "const sum = require('./index');\n\ndescribe('sum function', () => {\n  test('adds two positive numbers', () => {\n    expect(sum(2, 3)).toBe(5);\n  });\n\n  test('adds a positive and a negative number', () => {\n    expect(sum(2, -3)).toBe(-1);\n  });\n\n  test('adds two negative numbers', () => {\n    expect(sum(-2, -3)).toBe(-5);\n  });\n});",
            },
          ],
        }
        processKata(result)
      }
    }
    fetchKata()
  }, [webContainer, params.id])

  /**
   * Handles editor mounting
   *
   * @param editor HTMLDivElement
   * @param monaco
   */
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
  }

  async function generateKata(e: any) {
    e.preventDefault()
    let term = e.target[0].value
    setCode("// Loading...")
    setTestCode("// Loading...")
    xtermRef.current?.clear()
    xtermRef.current?.write("Generating kata...\n")
    let res = await fetch(`/api?q=${term}`).then((res) => res.json())
    console.info("res", res)
    processKata(res)
  }

  function processKata(result: any) {
    console.info("result", result)
    setKata(result)

    try {
      result.code.map((code: any) => {
        if (code) {
          if (code.filename.includes("test")) {
            setTestCode(code.content)
            console.info("Test code set")
          } else if (
            !code.filename.includes("solution") &&
            !code.filename.includes("test")
          ) {
            setCode(code.content)
            console.info("Code set")
          }

          xtermRef.current?.clear()
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function doSearch(e: Event | null, term: string | null = null) {
    let kata
    if (e) {
      e.preventDefault()
      term = (e.target as HTMLFormElement)?.[0]?.value
    }

    if (term) {
      const { data } = await supabase
        .from("katas")
        .select("*")
        .eq("id", term)
        .limit(1)
      console.log("data", data)
      kata = data[0]
    } else {
      const { data } = await supabase.from("katas").select("*").limit(1)
      console.log("data", data)
      kata = data[0]
    }

    console.info("kata", kata)
    processKata(kata)
  }

  async function next() {
    setShowConfetti(false)
    const { count } = await supabase
      .from("katas")
      .select("*")
      .limit(1);
    router.push(`/kata/${data[0].id}`)
  }

  /**
   * find entry in kata where filename contains solution and set code to that
   */
  function solve() {
    const solution = kata.code.find((code: any) =>
      code.filename.includes("solution")
    )
    setCode(solution.content)
    setReloadCode(Math.random())
  }

  /**
   * Runs tests
   */
  async function runTests() {
    await webContainer?.fs.writeFile("index.js", code)
    await webContainer?.fs.writeFile("index.test.js", testCode)

    const jestProcess = await webContainer.spawn("npx", ["jest"])
    let exitCode = await jestProcess.exit
    if (exitCode === 0) {
      setShowConfetti(true)

      const { data: solution } = await supabase
        .from("solutions")
        .insert({ kata_id: kata.id, code })

      console.log("solution", solution)

      const { data: solutions } = await supabase
        .from("solutions_report")
        .select("*")

      console.log("solutions", solutions)
    }

    xtermRef.current?.clear()
    xtermRef.current?.writeln("Running tests...")

    jestProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          xtermRef.current?.writeln(data)
        },
      })
    )
  }

  if (!kata) {
    return
  }

  return (
    <main className="flex min-h-screen flex-col items-center md:p-2 bg-black">
      {showConfetti && <Confetti width={width} height={height} />}

      <div className="p-5 md:pb-5 w-full">
        <span className="mb-2 inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
          {kata.difficulty}
        </span>

        <div className="text-xl text-white font-bold mb-2">{kata.title}</div>
        <div className="text-gray-500">{kata.description}</div>
      </div>

      <div className="w-full flex h-10 border-2 border-gray-900">
        <button
          className={`text-gray-500 w-full border-b-2 p-1 ${
            activeTab === "code" ? "border-pink-500" : "border-transparent"
          }`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          className={`text-gray-500 w-full border-b-2 p-1 ${
            activeTab === "tests" ? "border-pink-500" : "border-transparent"
          }`}
          onClick={() => setActiveTab("tests")}
        >
          Tests
        </button>
      </div>

      <div className="w-full flex gap-1">
        {activeTab === "code" && (
          <div className="flex-1">
            <Editor
              key={reloadCode}
              theme="vs-dark"
              height="30vh"
              defaultLanguage="javascript"
              defaultValue={code}
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        )}

        {activeTab === "tests" && (
          <div className="flex-1">
            <Editor
              key={testCode}
              theme="vs-dark"
              height="30vh"
              defaultLanguage="javascript"
              defaultValue={testCode}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 m-3">
        <button
          className={`rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
            webContainerReady
              ? "bg-indigo-500 hover:bg-indigo-400 text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
          onClick={runTests}
          disabled={!webContainerReady}
        >
          {webContainerReady ? (
            "Run Tests"
          ) : (
            <div className="flex items-center">
              <span>Loading...</span>
            </div>
          )}
        </button>

        <button
          className="rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          onClick={solve}
        >
          Solve
        </button>

        <button
          className="rounded-md bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          onClick={next}
        >
          Next
        </button>
      </div>

      <div className="w-full w-11/12 border-t-2 border-gray-800">
        <div className="p-2 text-gray-400 text-sm">Terminal</div>
        <div className="p-3">
          <XTerm ref={xtermRef} />
        </div>
      </div>
    </main>
  )
}
