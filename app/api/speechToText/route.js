import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  const req = await request.json()
  const mp3Audio = req.audio
  const audio = Buffer.from(mp3Audio, "base64").toString() // convert to string
  try {
    const text = await convertAudioToText(audio)
    return NextResponse.json({ result: text }, { status: 200 })
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return NextResponse.json({ error: error.response.data }, { status: 500 })
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return NextResponse.json(
        { error: "An error occurred during your request." },
        { status: 500 }
      )
    }
  }
}

async function convertAudioToText(audioData) {
  try {
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: {
        data: audioData,
        contentType: "audio/mp3"
      }
    })
    const transcribedText = response.text
    return transcribedText
  } catch (error) {
    console.error(`Error with OpenAI audio transcription: ${error.message}`)
    throw new Error("An error occurred during audio transcription.")
  }
}
