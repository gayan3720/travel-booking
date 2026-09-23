import { NextResponse } from "next/server";
import { getPosts, getAllPostsAdmin, createPost } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  if (isAdmin) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const all = await getAllPostsAdmin();
    return NextResponse.json(all);
  }

  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const excerpt = body.excerpt || body.content.slice(0, 150) + "...";
    const created = await createPost({ ...body, slug, excerpt });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post", details: String(error) }, { status: 500 });
  }
}
