"use client"

import { Alert, message } from "antd"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRef, useState } from "react"

import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"

import { Button } from "@/components/ui/button"
import Editor from "@monaco-editor/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactMarkdown from "react-markdown"
import SelectPlaylist from "@/components/SelectPlaylist"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { funky as theme } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useChat } from "ai/react"
import { useRouter } from "next/navigation"

import TranscribeButton from "@/components/TranscribeButton"

export default function Answer(props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
    isLoading,
  } = useChat({
    onFinish: (message) => {
      if (message.content.toLowerCase().startsWith("yes")) {
        setShowConfetti(true)
      }
    },
  })

  const monacoRef = useRef(null)
  const supabase = createClientComponentClient()
  let router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  const [followup, setFollowup] = useState<string>("")
  const [card, setCard] = useState<any>(props.card)
  const [code, setCode] = useState<any>("")
  const [type, setType] = useState<string>(props.card.type)
  const [answer, setAnswer] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [isErrors, setIsErrors] = useState<any>(false)

  function handleEditorDidMount(editor, monaco) {
    monacoRef.current = monaco
  }

  function doHandleInputChange(e) {
    e.preventDefault()
    setFollowup(e.target.value)
    handleInputChange(e)
  }

  async function doCheck(e) {
    e.preventDefault()

    if (card.type === "code") {
      console.log("markers", monacoRef.current.editor.getModelMarkers())
      let isErrors = monacoRef.current.editor.getModelMarkers().length
      setIsErrors(isErrors)
      console.log("isErrors", isErrors)
      if (isErrors) {
        return false
      }
    }

    if (!followup) {
      append({
        role: "user",
        content: `In JavaScript, is this the correct answer to the question? Question: ${card.question}. Answer: ${e.target.answer.value}. If not, show the correct answer.`,
      })
    }

    if (followup) {
      append({
        role: "user",
        content: `${followup}`,
      })
    }
  }

  async function handleClearMessages() {
    setMessages([])
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
      .from("cards_random")
      .select("*")
      .eq("card_id", card.id)
      .single()


    const { data } = await supabase
      .from("cards_random")
      .select("*")
      .limit(1)
    router.push(`/cards/${data[0].id}`)
  }

  const userMessageClass = "text-pink-400 font-bold"
  const aiMessageClass = "text-white-500"

  return (
    <div className="m-5">
      {contextHolder}
      {showConfetti && <Confetti width={width} height={height} />}

      <form onSubmit={doCheck}>
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>{card.question}</CardTitle>
            <CardDescription>
              {type.charAt(0).toUpperCase() + type.slice(1)} Answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {" "}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Response Type</Label>
                <Select value={type} onValueChange={(val) => setType(val)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Answer</Label>
                {type == "text" && (
                  <Textarea
                    name="answer"
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your response here"
                    value={answer}
                  />
                )}
                {/* <TranscribeButton onFinish={(data) => setAnswer(data)}/> */}
                {type == "code" && (
                  <>
                    <input type="hidden" name="answer" value={code} />
                    <Editor
                      // key={codeView.toString()}
                      theme="vs-dark"
                      height="30vh"
                      width="100%"
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
              </div>
              {isErrors ? (
                <Alert
                  message="Cannot submit with syntax errors"
                  type="warning"
                  className="mt-3"
                />
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-1 mt-4 mb-4">
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleClearMessages}
                loading={isLoading}
              >
                Check
              </Button>
              <Button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                disabled={isLoading}
                variant="outline"
              >
                Reveal
              </Button>
              <Button type="button" onClick={doDelete} variant="outline">
                Delete
              </Button>
              <Button type="button" onClick={next} variant="outline">
                Next
              </Button>
              {/* <SelectPlaylist card_id={card.id} /> */}
            </div>
          </CardFooter>
        </Card>
      </form>

      <div className="border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {showAnswer && (
                <div className="mt-2 text-white">
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

              <div className="text-white">
                {messages.length
                  ? messages.slice(1).map((m) => (
                      <ReactMarkdown
                        key={m.id}
                        className={`${
                          m.role === "user" ? userMessageClass : aiMessageClass
                        } p-2 rounded-lg mb-2`}
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
                                className="text-red-900"
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
                      className="text-white bg-black mt-5 p-2 border rounded-lg w-[100%]"
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
