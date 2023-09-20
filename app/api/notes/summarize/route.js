import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export async function POST(req, res) {
  const { notes } = await req.json()

  let content = `Please summarize these notes. Provide the response in the following format. { "summary": "" } . ${notes}`
  let messages = [{ role: "user", content }]

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    // stream: true,
    messages,
  })
  return NextResponse.json({ response: response.choices[0].message.content })
  // res.status(200).json({ response: response.content });
  // const stream = OpenAIStream(response);
  // return new StreamingTextResponse(stream);
}
