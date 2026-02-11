import { auth } from "@/lib/auth"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { headers } from "next/headers"
import { inngest } from "@/inngest/client"
import { createResume } from "@/db/resume"

const f = createUploadthing()

export const ourFileRouter = {
  resumeUploader: f({
    pdf: {
      maxFileCount: 1,
      maxFileSize: "4MB"
    }
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) {
        throw new UploadThingError("Unauthorized")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.ufsUrl)

      const resume = await createResume({
        userId: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name
      })

      console.log("Created resume record:", resume.id)

      await inngest.send({
        name: "resume/process",
        data: {
          resumeId: resume.id,
          fileUrl: file.ufsUrl
        }
      })

      return {
        uploadedBy: metadata.userId,
        resumeId: resume.id,
        fileName: file.name,
        fileUrl: file.ufsUrl
      }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
