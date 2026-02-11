import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Focalpoint</h1>
        <Button>Get Started</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Focalpoint</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
export default Home
