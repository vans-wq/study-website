import { prisma } from "@/lib/prisma"

export default async function TestPage() {
  const posts = await prisma.post.findMany()

  return (
    <div>
      <h1>Posts</h1>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  )
}