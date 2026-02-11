import prisma from "@/db/prisma"

type WorkExperience = {
  company: string
  title: string
  startDate: string
  endDate: string | null
  description: string
}
type Education = {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
}
type Certification = {
  name: string
  issuer: string
  date: string
}
type Project = {
  name: string
  description: string
  technologies: string[]
}

export const createResume = async (data: {
  userId: string
  fileUrl: string
  fileKey: string
  fileName: string
}) => {
  return await prisma.resume.create({
    data: {
      userId: data.userId,
      fileUrl: data.fileUrl,
      fileKey: data.fileKey,
      fileName: data.fileName,
      status: "uploaded"
    }
  })
}

export const saveParsedResume = async (
  resumeId: string,
  data: {
    rawText: string
    name?: string
    email?: string
    phone?: string
    location?: string
    summary?: string
    skills?: string[]
    workExperience?: WorkExperience[]
    education?: Education[]
    certifications?: Certification[]
    projects?: Project[]
  }
) => {
  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      rawText: data.rawText,
      status: "parsed"
    }
  })

  return await prisma.parsedResume.upsert({
    where: { resumeId },
    create: {
      resumeId,
      rawText: data.rawText,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      summary: data.summary,
      skills: data.skills || [],
      workExperience: data.workExperience || [],
      education: data.education || [],
      certifications: data.certifications || [],
      projects: data.projects || []
    },
    update: {
      rawText: data.rawText,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      summary: data.summary,
      skills: data.skills || [],
      workExperience: data.workExperience || [],
      education: data.education || [],
      certifications: data.certifications || [],
      projects: data.projects || []
    }
  })
}
