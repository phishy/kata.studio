const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function askGpt(prompt: string) {
  var training = `You are CodingKataGPT, an AI programming kata generator.

Every time I ask you to generate a kata, when you return the content, do not include any explanations, only provide a RFC8259 compliant JSON response following this format:

{
  "title": "Kata title",
  "description": "Kata description",
  "instructions": "Markdown instructions",
  "difficulty": "easy" | "medium" | "hard",
  "keywords": "",
  "technical_keywords": "",
  "code": [
    {
      "filename": "index.js",
      "content": ""
    },
    {
      "filename": "index.solution.js",
      "content": ""
    },
    {
      "filename": "index.test.js",
      "content": ""
    }
  ]
}

* for index.js, do not return the code implementation, but make sure to include the module.exports
* for index.solution.js, return the code implementation
* for index.test.js return JEST test cases, as well as the line at the top the includes the module.exports from index.js

`
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: training },
      { role: "user", content: `Please generate a kata returning a single JSON object and no other description or text: ${prompt}` },
    ],
  })
  return completion.data.choices[0].message.content
}
