"use client"

import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import SelectPlaylist from "@/components/SelectPlaylist"
import { useRouter } from "next/navigation"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { funky as theme } from "react-syntax-highlighter/dist/esm/styles/prism"

import { HiXCircle, HiCheckCircle } from "react-icons/hi2"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from "react-markdown"

import { message } from "antd"

export default function Answer(props) {
  let router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [card, setCard] = useState<any>(props.card)
  const [code, setCode] = useState<any>("")
  const [codeView, setCodeView] = useState<boolean>(false)
  const [answer, setAnswer] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false)

  async function doCheck() {
    let content = `In JavaScript, is this the correct answer to the question? Question: ${card.question}. Answer: ${code}`
    let messages = [{ role: "user", content }]

    setIsLoading(true)
    let res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    setIsLoading(false)

    let response = await res.json()
    setAnswer(response.response)
  }

  const doDelete = async () => {
    let { error } = await supabase.from("cards").delete().eq("id", card.id)
    if (error) {
      let content = !error.code.length
        ? "Network error. Unable to delete card."
        : error.message
      messageApi.open({
        type: "error",
        content,
        style: {
          marginTop: "20vh",
        },
      })
    } else {
      router.push("/cards")
    }
  }

  return (
    <div className="m-5">
      {contextHolder}
      <div className="px-4 sm:px-0">
        <h3 className="text-2xl text-base font-semibold leading-7 text-zinc-400">
          {card.question}
        </h3>
        {/* <p className="text-xl mt-1 max-w-2xl leading-6 text-gray-500">
          {card.question}
        </p> */}
      </div>
      <div className="mt-6 border-gray-100">
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
            <dt className="text-sm font-medium leading-6 text-white">Answer</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <Switch onCheckedChange={(val) => setCodeView(val)} />
              <div className="text-white">Code</div>
              {!codeView && (
                <Textarea onChange={(val) => setCode(val.target.value)}>
                  {code}
                </Textarea>
              )}
              {codeView && (
                <Editor
                  key={codeView.toString()}
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
              <div className="flex gap-1 mb-4">
                {/* <Button
                  type="button"
                  onClick={() => {
                    const synth = window.speechSynthesis
                    const utterance = new SpeechSynthesisUtterance(
                      card.question
                    )
                    synth.speak(utterance)
                  }}
                  className="mt-5"
                  disabled={isLoading}
                >
                  Speak
                </Button> */}
                <Button
                  type="button"
                  onClick={doCheck}
                  className="mt-5 bg-zinc-900"
                  disabled={isLoading}
                >
                  Check
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="mt-5 bg-zinc-900"
                  disabled={isLoading}
                >
                  Show Answer
                </Button>
                {/* <Button type="button" onClick={doCheck} className="mt-5">
                  Save
                </Button> */}
                <Button
                  type="button"
                  onClick={doDelete}
                  className="mt-5 bg-zinc-900"
                >
                  Delete
                </Button>
              </div>
              <SelectPlaylist card_id={card.id} />
              {showAnswer && (
                <ReactMarkdown
                  children={card.answer}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, "")}
                          style={theme}
                          language={match[1]}
                          PreTag="div"
                        />
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    },
                  }}
                />
              )}
              <div className="mt-10">
                {answer.startsWith("No") && <HiXCircle size={50} color="red" />}
                {answer.startsWith("Yes") && (
                  <HiCheckCircle size={50} color="green" />
                )}
                <ReactMarkdown
                  children={answer}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, "")}
                          style={theme}
                          language={match[1]}
                          PreTag="div"
                        />
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    },
                  }}
                />
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
