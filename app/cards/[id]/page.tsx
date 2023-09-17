"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

import { HiXCircle, HiCheckCircle } from "react-icons/hi2"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from 'react-markdown'

export const revalidate = 60

export default function CardForm({ params }) {
  const [card, setCard] = useState<any>({})
  const [code, setCode] = useState<string>("")
  const [codeView, setCodeView] = useState<boolean>(false)
  const [answer, setAnswer] = useState<string>("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCard() {
      let { error, data } = await supabase
        .from("cards")
        .select("*")
        .eq("id", params.id)
        .single()
      setCard(data)
      setCode(data.answer)
    }
    fetchCard()
  }, [params.id])

  async function doCheck() {
    console.log("yooo", code)
    let content = `In JavaScript, is this the correct answer to the question? Question: ${card.question}. Answer: ${code}`
    let messages = [{ role: "user", content }]

    let res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    let response = await res.json()
    setAnswer(response.response)
  }

  return (
    <div className="m-5">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {card.title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          { card.question}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Title
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {card.title}
            </dd>
          </div> */}
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Question
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {card.question}
            </dd>
          </div> */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Answer
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <Switch onCheckedChange={(val) => setCodeView(val)} /> Code
              {!codeView && <Textarea onChange={(val) => setCode(val.target.value)}>{code}</Textarea>}
              {codeView && (
                <Editor
                  key={codeView}
                  theme="vs-dark"
                  height="30vh"
                  defaultLanguage="javascript"
                  // defaultValue={card.answer}
                  onChange={(value) => {
                    // console.log("value", value)
                    setCode(value)
                  }}
                  // onMount={handleEditorDidMount}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              )}
              <Button type="button" onClick={doCheck} className="mt-5">
                Check
              </Button>
              <div className="mt-10">
                {answer.startsWith("No") && <HiXCircle size={50} color="red" />}
                {answer.startsWith("Yes") && (
                  <HiCheckCircle size={50} color="green" />
                )}
                <ReactMarkdown children={answer} />
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
