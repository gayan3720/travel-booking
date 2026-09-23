import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug, getPosts } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  return (
    <article className="max-w-3xl mx-auto px-4 py-14">
      <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {new Date(post.createdAt).toDateString()}
      </p>
      <h1 className="font-display text-5xl md:text-6xl mt-3">{post.title}</h1>
      <div className="relative h-72 rounded-[2rem] overflow-hidden my-8">
        <Image src={post.coverImage} alt="" fill className="object-cover" />
      </div>
      <div className="prose prose-lg max-w-none text-foreground/85 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}
