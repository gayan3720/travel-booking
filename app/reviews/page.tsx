import { getApprovedReviews, getPackages } from "@/lib/data";
import ReviewList from "@/components/public/ReviewList";
import ReviewSubmitForm from "@/components/public/ReviewSubmitForm";

export const revalidate = 60;
export const metadata = { title: "Stories" };

export default async function ReviewsPage() {
  const [reviews, packages] = await Promise.all([getApprovedReviews(), getPackages()]);
  return (
    <main className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="font-display text-6xl">Stories</h1>
      <p className="text-muted-foreground mt-3 mb-10">Published only after a planner reads them. No fake five-stars.</p>
      <ReviewList reviews={reviews} />
      <div className="mt-14 glass rounded-[1.8rem] p-8">
        <h2 className="font-display text-3xl mb-4">Share yours</h2>
        <ReviewSubmitForm packageId={packages[0]?._id} />
      </div>
    </main>
  );
}
