"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

import * as z from "zod"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

import { useChat } from "ai/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  title: z.string(),
  question: z.string(),
  answer: z.string().optional(),
})

export default function NewCardForm() {
  let router = useRouter()
  const supabase = createClientComponentClient()

  const generate = useMutation({
    mutationFn: async (question) => {
      let content = `In JavaScript, what is the answer to this question? ${question}`
      let messages = [{ role: "user", content }]

      let res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      let response = await res.json()
      form.setValue("answer", response.response)
      // return response.response
    },
  })
  console.log("generate", generate)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  /**
   * Generates a chat message by sending a question to the chatbot API and setting the answer in the form.
   * @returns void
   */
  // async function generate(): Promise<void> {
  //   let content = `In JavaScript, what is the answer to this question? ${
  //     form.getValues().question
  //   }`
  //   let messages = [{ role: "user", content }]

  //   let res = await fetch("/api/chat", {
  //     method: "POST",
  //     body: JSON.stringify({ messages }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })

  //   let response = await res.json()
  //   form.setValue("answer", response.response)
  // }

  /**
   * Handles form submission by inserting the form data into the "cards" table in Supabase.
   * If there is an error, an alert is shown.
   * If the insertion is successful, the user is redirected to the "/cards" page.
   * @param data The form data to be inserted into the "cards" table.
   */
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let { error } = await supabase.from("cards").insert(data)
    if (error) {
      alert("error")
      return
    }
    router.push("/cards")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 m-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  form.setValue("title", e.target.value)
                  form.setValue("question", e.target.value)
                }} />
              </FormControl>
              <FormDescription>Title of the study card</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Description of the study card</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Answer of the study card</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="secondary"
            disabled={generate.isLoading}
            onClick={(e) => {
              e.preventDefault()
              generate.mutate(form.getValues().question)
            }}
          >
            Generate
          </Button>
          <Button type="submit" disabled={generate.isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
