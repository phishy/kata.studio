"use client"

import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import SelectPlaylist from "@/components/SelectPlaylist"
import { useRouter } from "next/navigation"

import { useChat } from "ai/react"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { funky as theme } from "react-syntax-highlighter/dist/esm/styles/prism"

import { HiXCircle, HiCheckCircle } from "react-icons/hi2"
import ReactMarkdown from "react-markdown"

import { Alert, message } from "antd"

export default function Answer(props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
  } = useChat()

  const monacoRef = useRef(null)
  const supabase = createClientComponentClient()
  let router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [followup, setFollowup] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [card, setCard] = useState<any>(props.card)
  const [code, setCode] = useState<any>("")
  const [codeView, setCodeView] = useState<boolean>(card.type === "code")
  const [answer, setAnswer] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [isErrors, setIsErrors] = useState<any>(false)

  function handleEditorDidMount(editor, monaco) {
    monacoRef.current = monaco
  }

  function doHandleInputChange(e) {
    setFollowup(e.target.value)
    handleInputChange(e)
  }

  async function doCheck(e) {
    e.preventDefault()

    if (messages.length) {
      setMessages([])
    }

    if (card.type === "code") {
      console.log("markers", monacoRef.current.editor.getModelMarkers())
      let isErrors = monacoRef.current.editor.getModelMarkers().length
      setIsErrors(isErrors)
      console.log("isErrors", isErrors)
      if (isErrors) {
        return false
      }
    }

    append({
      role: "user",
      content: `In JavaScript, is this the correct answer to the question? Question: ${card.question}. Answer: ${e.target.answer.value}. If not, show the correct answer.`,
    })

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

  async function next() {
    const { count } = await supabase
      .from("cards")
      .select("*", { count: "exact", head: true })
    console.log("count", count)
    let random = Math.floor(Math.random() * count - 1)
    const { data } = await supabase
      .from("cards")
      .select("*")
      .range(random, random + 1)
    router.push(`/cards/${data[0].id}`)
  }

  return (
    <div className="m-5">
      {contextHolder}
      <div className="px-4 sm:px-0">
        {card.difficulty && (
          <span className="mb-2 inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
            {card.difficulty}
          </span>
        )}
        {/* <h3 className="text-2xl text-base font-semibold leading-7 text-zinc-400">
          {card.question}
        </h3> */}
        <div className="flex flex-col bg-zinc-800 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
          <div className="p-4 md:p-10">
            <h3 className="text-lg font-light  dark:text-white">
              {card.question}
            </h3>
            {/* <p class="mt-2 text-gray-800 dark:text-gray-400">
              With supporting text below as a natural lead-in to additional
              content.
            </p> */}
          </div>
        </div>
        {isErrors ? (
          <Alert
            message="Cannot submit with syntax errors"
            type="warning"
            className="mt-3"
          />
        ) : null}
        {/* <p className="text-xl mt-1 max-w-2xl leading-6 text-gray-500">
          {card.question}
        </p> */}
      </div>
      <div className="border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <form onSubmit={doCheck}>
                {!messages.length && !showAnswer && !codeView && (
                  <Textarea
                    name="answer"
                    onChange={handleInputChange}
                    value={input}
                  ></Textarea>
                )}
                {codeView && (
                  <>
                    <input type="hidden" name="answer" value={code} />
                    <Editor
                      key={codeView.toString()}
                      theme="vs-dark"
                      height="30vh"
                      onMount={handleEditorDidMount}
                      defaultLanguage="javascript"
                      onChange={(value) => {
                        setCode(value)
                      }}
                      options={{
                        minimap: {
                          enabled: false,
                        },
                      }}
                    />
                  </>
                )}
                <div className="flex gap-1 mb-4">
                  <Button
                    type="submit"
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
                  <Button
                    type="button"
                    onClick={doDelete}
                    className="mt-5 bg-zinc-900"
                  >
                    Delete
                  </Button>
                  <Button
                    type="button"
                    onClick={next}
                    className="mt-5 bg-zinc-900"
                  >
                    Next
                  </Button>
                </div>
              </form>
              <SelectPlaylist card_id={card.id} />
              {showAnswer && (
                <div className="mt-5 text-white">
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
                </div>
              )}
              <div className="mt-10 text-white">
                {answer.startsWith("No") && <HiXCircle size={50} color="red" />}
                {answer.startsWith("Yes") && (
                  <HiCheckCircle size={50} color="green" />
                )}
                {messages.length
                  ? messages.slice(1).map((m) => (
                      <ReactMarkdown
                        key={m.id}
                        children={m.content}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
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
                    ))
                  : null}
                {messages.length ? (
                  <form
                    onSubmit={(e) => {
                      setFollowup("")
                      doCheck(e)
                    }}
                  >
                    <input
                      name="answer"
                      value={followup}
                      className="text-white bg-black mt-5 p-2 border rounded-lg"
                      placeholder="Say something..."
                      onChange={doHandleInputChange}
                    />
                  </form>
                ) : null}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
