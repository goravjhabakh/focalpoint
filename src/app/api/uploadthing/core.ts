import { auth } from "@/lib/auth"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { headers } from "next/headers"
import { inngest } from "@/inngest/client"

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

      await inngest.send({
        name: "resume/process",
        data: {
          fileUrl: file.ufsUrl,
          userId: metadata.userId
        }
      })

      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
