import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts, getPackages } from "@/lib/data";
import { brand } from "@/lib/catalog";
import { Sparkles, Calendar, Clock, ArrowRight, Compass, ShieldCheck, Share2 } from "lucide-react";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${brand.name} Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allPosts, packages] = await Promise.all([
    getPostBySlug(params.slug),
    getPosts(),
    getPackages(),
  ]);

  if (!post) notFound();

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const featuredCircuit = packages[0];

  return (
    <main className="max-w-4xl mx-auto px-4 py-14 space-y-10">
      {/* Article Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Ceylon Travel Journal
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-foreground font-medium leading-tight">
          {post.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            4 min read
          </span>
          <span>·</span>
          <span>Curated by Aether Trails Editorial</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 rounded-[2.5rem] overflow-hidden border border-black/10 shadow-md">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Article Body */}
      <article className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-serif bg-white p-6 sm:p-10 rounded-3xl border border-black/5 shadow-xs">
        {post.content}
      </article>

      {/* Embedded High-Converting Itinerary Callout */}
      {featuredCircuit && (
        <div className="bg-[#1b1511] text-[#f7eee1] rounded-3xl p-6 sm:p-8 border border-[#423326] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] flex items-center gap-1 justify-center sm:justify-start">
              <Compass className="w-3.5 h-3.5" />
              Experience This On The Road
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-medium">
              {featuredCircuit.title} ({featuredCircuit.durationDays} Days)
            </h3>
            <p className="text-xs text-white/70 max-w-lg">
              Privately chauffeured route covering ancient ruins, misty tea gaps, and secluded southern coastline.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href={`/packages/${featuredCircuit.slug}`}
              className="px-6 py-3 rounded-full bg-[#c59b27] text-[#17120e] text-xs font-semibold hover:bg-[#d9ab2d] transition shadow-md whitespace-nowrap flex items-center gap-1.5"
            >
              <span>View Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/planner"
              className="px-5 py-3 rounded-full bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition whitespace-nowrap"
            >
              Cost Estimator
            </Link>
          </div>
        </div>
      )}

      {/* More Journal Dispatches */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-black/10">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-foreground font-medium">
              More Ceylon Dispatches
            </h3>
            <Link href="/blog" className="text-xs font-semibold text-primary hover:underline">
              All Journal Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((r) => (
              <Link
                key={r._id}
                href={`/blog/${r.slug}`}
                className="group flex gap-4 bg-white p-4 rounded-2xl border border-black/10 hover:border-black/20 hover:shadow-md transition"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={r.coverImage}
                    alt={r.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <h4 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
