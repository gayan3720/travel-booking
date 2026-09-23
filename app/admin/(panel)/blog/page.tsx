import { getPosts } from "@/lib/data";

export default async function AdminBlogPage() {
  const posts = await getPosts();
  return (
    <div>
      <h1 className="font-display text-4xl mb-6">Journal CMS</h1>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl p-5 border">
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-muted-foreground">{p.slug} · published</p>
          </div>
        ))}
      </div>
    </div>
  );
}
