"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<"email" | "google" | "github" | null>(
    null
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: SignInFormData) => {
    setLoading("email")
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password
      })
      toast.success("Signed in successfully!")
      router.push("/")
    } catch (error) {
      toast.error("Failed to sign in", {
        description:
          error instanceof Error ? error.message : "Invalid credentials"
      })
    } finally {
      setLoading(null)
    }
  }

  const handleProviderSignIn = async (provider: "google" | "github") => {
    setLoading(provider)
    try {
      await authClient.signIn.social({
        provider
      })
    } catch (error) {
      toast.error("Failed to sign in", {
        description:
          error instanceof Error ? error.message : "Something went wrong"
      })
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Sign In to <span className="text-primary">Focal Point</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              disabled={loading !== null}
              onClick={() => handleProviderSignIn("google")}
            >
              {loading === "google" ?
                <Spinner className="size-4" />
              : <FaGoogle className="mr-2 size-4" />}
              Google
            </Button>
            <Button
              variant="outline"
              disabled={loading !== null}
              onClick={() => handleProviderSignIn("github")}
            >
              {loading === "github" ?
                <Spinner className="size-4" />
              : <FaGithub className="mr-2 size-4" />}
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={loading !== null}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                disabled={loading !== null}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading !== null}
              className="w-full"
            >
              {loading === "email" ?
                <Spinner className="size-4" />
              : <span>Sign In</span>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-muted-foreground">
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
