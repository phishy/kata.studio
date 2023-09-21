"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useChat } from "ai/react"
import { createCard } from "@/app/actions"

export default function NewCardForm() {
  const [ isGenerating, setIsGenerating ] = useState<boolean>(false)
  const [answer, setAnswer] = useState<string>("")
  const { messages, input, handleInputChange, append } = useChat({
    onFinish: (messages) => {
      setIsGenerating(false)
      setAnswer(JSON.parse(messages.content).answer)
    },
  })

  function handleSubmit(e) {
    const submitButton = e.nativeEvent.submitter

    if (submitButton.name === "generate") {
      e.preventDefault()
      doGenerate(e)
    } else if (submitButton.name === "save") {
      return true;
    }
  }

  function doGenerate(e) {
    setIsGenerating(true)
    let question = e.target.question.value
    append({
      role: "user",
      content: `In JavaScript, what is the answer to this question? Provide the response in the following format. { "answer": "", "difficulty": ""} . ${question}`,
    })
  }

  return (
    <form action={createCard} onSubmit={handleSubmit} className="m-5">
      <label>Title</label>
      <Input
        value={input}
        name="title"
        className="text-white bg-black m-5"
        placeholder="Say something..."
        onChange={handleInputChange}
      />
      <label>Question</label>
      <Textarea
        value={input}
        name="question"
        className="text-white bg-black m-5"
        placeholder="Say something..."
        onChange={handleInputChange}
      />
      <label>Answer</label>
      <Textarea
        value={answer}
        name="answer"
        onChange={(e) => setAnswer(e.target.value)}
        className="text-white bg-black m-5"
      />
      {/* {messages.slice(1).map((m) => (
        <div key={m.id} className="p-5">
          {m.role}: {m.content}
        </div>
      ))} */}
      <Button name="generate" type="submit" disabled={isGenerating}>
        { isGenerating ? "Generating..." : "Generate"}
      </Button>
      <Button name="save" type="submit" disabled={isGenerating}>
        Save
      </Button>
    </form>
  )
}
