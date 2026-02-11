import "pdf-parse/worker"
import { inngest } from "./client"
import { PDFParse } from "pdf-parse"

export const processResume = inngest.createFunction(
  { id: "process-resume" },
  { event: "resume/process" },
  async ({ event, step }) => {
    const { fileUrl, userId } = event.data as {
      fileUrl: string
      userId: string
    }

    console.log(userId)

    const text = await step.run("parse-pdf", async () => {
      const parser = new PDFParse({ url: fileUrl })
      const text = await parser.getText()
      await parser.destroy()
      return text
    })

    return { text }
  }
)
