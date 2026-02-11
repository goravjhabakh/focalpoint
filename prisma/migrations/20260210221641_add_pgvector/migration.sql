-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector columns (Prisma can't manage these natively)
ALTER TABLE "resume" ADD COLUMN IF NOT EXISTS embedding vector(768);
ALTER TABLE "job" ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create IVFFlat indexes for fast similarity search
CREATE INDEX IF NOT EXISTS idx_resume_embedding
  ON "resume" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_job_embedding
  ON "job" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
