import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export async function POST(req, res) {
  const { messages } = await req.json()

  // let content = `In JavaScript, what is the answer to this question? Provide the response in the following format. { "answer": "", "difficulty": ""} . ${question}`
  // let messages = [{ role: "user", content }]

  const response = await openai.chat.completions.create({
    // model: "gpt-4",
    model: "gpt-3.5-turbo",
    // stream: true,
    messages,
  })
  return NextResponse.json({ response: response.choices[0].message.content })
  // res.status(200).json({ response: response.content });
  // const stream = OpenAIStream(response);
  // return new StreamingTextResponse(stream);
}
