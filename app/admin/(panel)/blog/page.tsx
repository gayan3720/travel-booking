import JournalManager from "@/components/admin/JournalManager";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-foreground">Travel Journal & Content CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish SEO travel guides, insider cultural stories, and packing tips to attract organic tourist traffic.
        </p>
      </div>

      <JournalManager />
    </div>
  );
}
