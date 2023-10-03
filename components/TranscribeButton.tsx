"use client"

import { useState, useEffect } from "react"
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"

const ffmpeg = createFFmpeg({
  // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
  // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
});

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
            // const audio = new Audio(audioUrl)
            // audio.onerror = function (err) {
            //   console.error("Error playing audio:", err)
            // }
            // audio.play()
            try {
              const reader = new FileReader()
              reader.readAsDataURL(audioBlob)
              reader.onloadend = async function () {
                // const base64Audio = reader.result.split(",")[1]
                await ffmpeg.load()
                ffmpeg.FS("writeFile", "audio.webm", await fetchFile(audioUrl))
                await ffmpeg.run("-i", "audio.webm", "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", "-f", "mp3", "audio.mp3")
                const mp3Data = ffmpeg.FS("readFile", "audio.mp3")
                // const mp3Url = URL.createObjectURL(new Blob([mp3Data.buffer], { type: "audio/mp3" }))
                // const mp3 = new Audio(mp3Url)
                // mp3.onerror = function (err) {
                //   console.error("Error playing audio:", err)
                // }
                // mp3.play()
                const response = await fetch("/api/speechToText", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ audio: mp3Data.buffer }),
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
