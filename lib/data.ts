import { readStore, writeStore, uid, type StoreShape } from "./store";
import type { BookingStatus } from "@/schemas/types";

export async function getPackages(filters?: { category?: string; destination?: string }) {
  const store = await readStore();
  return store.packages.filter((p) => {
    if (!p.isActive) return false;
    if (filters?.category && p.category !== filters.category) return false;
    if (filters?.destination && p.destination !== filters.destination) return false;
    return true;
  });
}

export async function getPackageBySlug(slug: string) {
  const store = await readStore();
  return store.packages.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function getVehicles() {
  const store = await readStore();
  return store.vehicles.filter((v) => v.isActive);
}

export async function getVehicleById(id: string) {
  const store = await readStore();
  return store.vehicles.find((v) => v._id === id && v.isActive) ?? null;
}

export async function getOffers() {
  const store = await readStore();
  const now = Date.now();
  return store.offers.filter((o) => o.isActive && new Date(o.endDate).getTime() >= now);
}

export async function getApprovedReviews(packageId?: string) {
  const store = await readStore();
  return store.reviews
    .filter((r) => r.isApproved && (!packageId || r.packageId === packageId))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getPendingReviews() {
  const store = await readStore();
  return store.reviews.filter((r) => !r.isApproved);
}

export async function getPosts() {
  const store = await readStore();
  return store.posts
    .filter((p) => p.isPublished)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getPostBySlug(slug: string) {
  const store = await readStore();
  return store.posts.find((p) => p.slug === slug && p.isPublished) ?? null;
}

export async function getBookings() {
  const store = await readStore();
  return [...store.bookings].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function createBooking(input: StoreShape["bookings"][number] extends infer T ? Omit<T, "_id" | "createdAt" | "status"> & { status?: BookingStatus } : never) {
  const store = await readStore();
  const booking = {
    ...input,
    _id: uid("bkg"),
    status: input.status ?? ("pending" as const),
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(booking);
  await writeStore(store);
  return booking;
}

export async function updateBooking(id: string, patch: Partial<StoreShape["bookings"][number]>) {
  const store = await readStore();
  const idx = store.bookings.findIndex((b) => b._id === id);
  if (idx < 0) return null;
  store.bookings[idx] = { ...store.bookings[idx], ...patch, _id: id };
  await writeStore(store);
  return store.bookings[idx];
}

export async function createReview(input: { customerName: string; rating: number; comment: string; packageId?: string }) {
  const store = await readStore();
  const review = {
    _id: uid("rev"),
    customerName: input.customerName,
    rating: input.rating,
    comment: input.comment,
    packageId: input.packageId,
    isApproved: false,
    createdAt: new Date().toISOString(),
  };
  store.reviews.unshift(review);
  await writeStore(store);
  return review;
}

export async function moderateReview(id: string, isApproved: boolean) {
  const store = await readStore();
  const idx = store.reviews.findIndex((r) => r._id === id);
  if (idx < 0) return null;
  store.reviews[idx].isApproved = isApproved;
  await writeStore(store);
  return store.reviews[idx];
}

export async function analytics() {
  const store = await readStore();
  const bookings = store.bookings;
  const byStatus = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});
  const packageHits = bookings.reduce<Record<string, number>>((acc, b) => {
    if (b.packageId) acc[b.packageId] = (acc[b.packageId] ?? 0) + 1;
    return acc;
  }, {});
  const popular = Object.entries(packageHits)
    .map(([id, count]) => ({
      package: store.packages.find((p) => p._id === id)?.title ?? id,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const conversion =
    bookings.length === 0 ? 0 : Math.round(((byStatus.confirmed ?? 0) / bookings.length) * 100);
  return {
    pending: byStatus.pending ?? 0,
    contacted: byStatus.contacted ?? 0,
    confirmed: byStatus.confirmed ?? 0,
    cancelled: byStatus.cancelled ?? 0,
    packages: store.packages.filter((p) => p.isActive).length,
    pendingReviews: store.reviews.filter((r) => !r.isApproved).length,
    conversion,
    popular,
    traffic: [
      { source: "Organic search", share: 48 },
      { source: "Direct", share: 27 },
      { source: "Instagram", share: 16 },
      { source: "Referral", share: 9 },
    ],
  };
}
