"use client"

import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"

export const ResumeUploader = () => {
  return (
    <UploadButton
      endpoint={"resumeUploader"}
      onClientUploadComplete={(res) => {
        console.log("Files: ", res)
        toast.success("File uploaded successfully")
      }}
      onUploadError={(error: Error) => {
        toast.error("File upload failed", {
          description: error.message
        })
      }}
    />
  )
}
