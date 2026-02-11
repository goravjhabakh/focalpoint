import "pdf-parse/worker"
import { inngest } from "./client"
import { PDFParse } from "pdf-parse"
import { saveParsedResume } from "@/db/resume"

export const processResume = inngest.createFunction(
  { id: "process-resume" },
  { event: "resume/process" },
  async ({ event, step }) => {
    const { fileUrl, resumeId } = event.data as {
      fileUrl: string
      resumeId: string
    }

    const text = await step.run("parse-pdf", async () => {
      const parser = new PDFParse({ url: fileUrl })
      const text = await parser.getText()
      await parser.destroy()
      return text
    })

    console.log("Extracted text length:", text.text.length)
    await step.run("save-to-db", async () => {
      return await saveParsedResume(resumeId, { rawText: text.text })
    })

    return { success: true, resumeId, textLength: text.text.length }
  }
)
