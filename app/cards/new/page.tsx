"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useChat } from "ai/react"
import { createCard } from "@/app/actions"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { funky as theme } from "react-syntax-highlighter/dist/esm/styles/prism"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Label } from "@/components/ui/label"

import ReactMarkdown from "react-markdown"

import { experimental_useFormStatus as useFormStatus } from "react-dom"

export default function NewCardForm() {
  const { pending } = useFormStatus()
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [question, setQuestion] = useState<string>("")
  const [answer, setAnswer] = useState<string>("")
  const { messages, input, handleInputChange, append } = useChat({
    onFinish: (message) => {
      setIsGenerating(false)
      setAnswer(message.content)
      console.log("message", message)
    },
  })

  function handleSubmit(e) {
    const submitButton = e.nativeEvent.submitter

    if (submitButton.name === "generate") {
      e.preventDefault()
      doGenerate(e)
    } else if (submitButton.name === "save") {
      return true
    }
  }

  async function handleCreate(formData: FormData) {
    const res = await createCard(formData)
    console.log("yo", res)
    if (res.error) {
      setErrorMessage(res.error)
    }
  }

  function doGenerate(e) {
    let question = e.target.question.value
    setIsGenerating(true)
    setQuestion(question)
    append({
      role: "user",
      content: `In JavaScript, what is the answer to this question? ${question}`,
    })
  }

  return (
    <div className="m-5">
      <form action={handleCreate} onSubmit={handleSubmit}>
        <input type="hidden" name="answer" value={answer} />
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Create a new card</CardTitle>
            <CardDescription>
              Create a new study card to help you learn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Type a question title"
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  name="question"
                  placeholder="Type a question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Type</Label>
                <Select defaultValue="code" name="type">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" name="generate" loading={isGenerating}>
              Generate
            </Button>
            <Button
              type="submit"
              name="save"
              variant="outline"
              loading={isGenerating || pending}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>

      {errorMessage ? (
        <Alert className="mt-5" variant="destructive">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="m-2 mt-5">
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
      </div>
    </div>
  )
}
