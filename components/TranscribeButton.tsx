"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

export default function Home(props) {
  const [result, setResult] = useState()
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  let chunks = []

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream)
          newMediaRecorder.onstart = () => {
            chunks = []
          }
          newMediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
          }
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" })
            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl)
            audio.onerror = function (err) {
              console.error("Error playing audio:", err)
            }
            audio.play()
            try {
              const reader = new FileReader()
              reader.readAsDataURL(audioBlob)
              reader.onloadend = async function () {
                const base64Audio = reader.result.split(",")[1]
                const response = await fetch("/api/speechToText", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ audio: base64Audio }),
                })
                const data = await response.json()
                if (response.status !== 200) {
                  throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                  )
                }
                props.onFinish(data.result)
                setResult(data.result)
              }
            } catch (error) {
              console.error(error)
              alert(error.message)
            }
          }
          setMediaRecorder(newMediaRecorder)
        })
        .catch((err) => console.error("Error accessing microphone:", err))
    }
  }, [])

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start()
      setRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  return (
    <Button type="button" onClick={recording ? stopRecording : startRecording} variant="outline">
      <Mic />
      {recording ? "Stop Recording" : "Start Recording"}
    </Button>
  )
}
