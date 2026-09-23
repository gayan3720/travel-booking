import { getPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="font-display text-6xl">Journal</h1>
      <p className="text-muted-foreground mt-3 mb-10">Guides written for guests, indexed for search.</p>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((p) => (
          <Link key={p._id} href={`/blog/${p.slug}`} className="group">
            <div className="relative h-52 rounded-[1.5rem] overflow-hidden">
              <Image src={p.coverImage} alt="" fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-3">
              {new Date(p.createdAt).toDateString()}
            </p>
            <h2 className="font-display text-3xl mt-1">{p.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
