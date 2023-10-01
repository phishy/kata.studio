import OpenAI from "openai";
import { exec } from 'child_process';
import fs from 'fs';
import { NextResponse } from "next/server";

const util = require('util');
const execAsync = util.promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const req = await request.json()
  const base64Audio = req.audio;
  const audio = Buffer.from(base64Audio, 'base64');
  try {
    const text = await convertAudioToText(audio);
    return NextResponse.json({result: text}, {status:200});
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json({ error: error.response.data }, {status:500});
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json({ error: "An error occurred during your request." }, {status:500});
    }
  }
}

async function convertAudioToText(audioData) {
  const mp3AudioData = await convertAudioToMp3(audioData);
  const outputPath = '/tmp/output.mp3';
  fs.writeFileSync(outputPath, mp3AudioData);
  const response = await openai.audio.transcriptions.create(
      { model: 'whisper-1', file: fs.createReadStream(outputPath) }
  );
  fs.unlinkSync(outputPath);
  const transcribedText = response.text;
  return transcribedText;
}

async function convertAudioToMp3(audioData) {
  const inputPath = '/tmp/input.webm';
  fs.writeFileSync(inputPath, audioData);
  const outputPath = '/tmp/output.mp3';
  await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);
  const mp3AudioData = fs.readFileSync(outputPath);
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  return mp3AudioData;
}
