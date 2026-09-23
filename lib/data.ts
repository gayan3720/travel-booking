import { readStore, writeStore, uid, type StoreShape } from "./store";
import type { BookingStatus } from "@/schemas/types";

export async function getPackages(filters?: {
  category?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
}) {
  const store = await readStore();
  return store.packages.filter((p) => {
    if (!p.isActive) return false;
    if (filters?.category && p.category !== filters.category) return false;
    if (filters?.destination && p.destination !== filters.destination) return false;
    if (filters?.minPrice && p.price < filters.minPrice) return false;
    if (filters?.maxPrice && p.price > filters.maxPrice) return false;
    if (filters?.duration) {
      if (filters.duration === "short" && p.durationDays > 3) return false;
      if (filters.duration === "medium" && (p.durationDays < 4 || p.durationDays > 6)) return false;
      if (filters.duration === "long" && p.durationDays < 7) return false;
    }
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

export async function getBookingById(id: string) {
  const store = await readStore();
  // Support both raw ID and partial ref matching (e.g. AT-2026-BKG-XXXX)
  const cleanId = id.trim().toLowerCase();
  return (
    store.bookings.find(
      (b) =>
        b._id.toLowerCase() === cleanId ||
        cleanId.endsWith(b._id.slice(-4).toLowerCase()) ||
        cleanId.includes(b._id.toLowerCase())
    ) ?? null
  );
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

export async function getAllReviewsAdmin() {
  const store = await readStore();
  return store.reviews;
}

export async function deleteReview(id: string) {
  const store = await readStore();
  const idx = store.reviews.findIndex((r) => r._id === id);
  if (idx < 0) return false;
  store.reviews.splice(idx, 1);
  await writeStore(store);
  return true;
}

export async function getAllPackagesAdmin() {
  const store = await readStore();
  return store.packages;
}

export async function getPackageById(id: string) {
  const store = await readStore();
  return store.packages.find((p) => p._id === id) ?? null;
}

export async function createPackage(input: {
  title: string;
  slug: string;
  description: string;
  destination: string;
  durationDays: number;
  price: number;
  category: string;
  images?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  included?: string[];
  excluded?: string[];
  maxPax?: number;
  isActive?: boolean;
}) {
  const store = await readStore();
  const pkg = {
    _id: uid("pkg"),
    title: input.title,
    slug: input.slug,
    description: input.description,
    destination: input.destination,
    durationDays: Number(input.durationDays) || 1,
    price: Number(input.price) || 0,
    category: input.category,
    images: input.images && input.images.length > 0 ? input.images : [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80"
    ],
    itinerary: input.itinerary && input.itinerary.length > 0 ? input.itinerary : [
      { day: 1, title: "Arrival & Orientation", description: "Airport reception and private transfer." }
    ],
    included: input.included ?? ["Private vehicle with chauffeur", "Daily breakfast"],
    excluded: input.excluded ?? ["International flights", "Personal expenses"],
    maxPax: Number(input.maxPax) || 8,
    isActive: input.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.packages.unshift(pkg);
  await writeStore(store);
  return pkg;
}

export async function updatePackage(id: string, patch: Partial<StoreShape["packages"][number]>) {
  const store = await readStore();
  const idx = store.packages.findIndex((p) => p._id === id);
  if (idx < 0) return null;
  store.packages[idx] = { ...store.packages[idx], ...patch, updatedAt: new Date().toISOString(), _id: id };
  await writeStore(store);
  return store.packages[idx];
}

export async function deletePackage(id: string) {
  const store = await readStore();
  const idx = store.packages.findIndex((p) => p._id === id);
  if (idx < 0) return false;
  store.packages.splice(idx, 1);
  await writeStore(store);
  return true;
}

// ---------------- Vehicle CRUD ----------------

export async function getAllVehiclesAdmin() {
  const store = await readStore();
  return store.vehicles;
}

export async function createVehicle(input: {
  name: string;
  type: string;
  capacity: number;
  ratePerDay: number;
  images?: string[];
  features?: string[];
  isActive?: boolean;
}) {
  const store = await readStore();
  const vehicle = {
    _id: uid("veh"),
    name: input.name,
    type: input.type,
    capacity: Number(input.capacity) || 4,
    ratePerDay: Number(input.ratePerDay) || 75,
    images: input.images && input.images.length > 0 ? input.images : [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80"
    ],
    features: input.features ?? ["Air conditioning", "Chauffeur included", "Bottled water"],
    isActive: input.isActive ?? true,
  };
  store.vehicles.unshift(vehicle);
  await writeStore(store);
  return vehicle;
}

export async function updateVehicle(id: string, patch: Partial<StoreShape["vehicles"][number]>) {
  const store = await readStore();
  const idx = store.vehicles.findIndex((v) => v._id === id);
  if (idx < 0) return null;
  store.vehicles[idx] = { ...store.vehicles[idx], ...patch, _id: id };
  await writeStore(store);
  return store.vehicles[idx];
}

export async function deleteVehicle(id: string) {
  const store = await readStore();
  const idx = store.vehicles.findIndex((v) => v._id === id);
  if (idx < 0) return false;
  store.vehicles.splice(idx, 1);
  await writeStore(store);
  return true;
}

// ---------------- Offer CRUD ----------------

export async function getAllOffersAdmin() {
  const store = await readStore();
  return store.offers;
}

export async function createOffer(input: {
  title: string;
  description: string;
  discountText: string;
  packageId?: string;
  promoCode?: string;
  image?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}) {
  const store = await readStore();
  const offer = {
    _id: uid("off"),
    title: input.title,
    description: input.description,
    discountText: input.discountText,
    packageId: input.packageId || undefined,
    promoCode: input.promoCode || undefined,
    image: input.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    startDate: input.startDate,
    endDate: input.endDate,
    isActive: input.isActive ?? true,
  };
  store.offers.unshift(offer);
  await writeStore(store);
  return offer;
}

export async function updateOffer(id: string, patch: Partial<StoreShape["offers"][number]>) {
  const store = await readStore();
  const idx = store.offers.findIndex((o) => o._id === id);
  if (idx < 0) return null;
  store.offers[idx] = { ...store.offers[idx], ...patch, _id: id };
  await writeStore(store);
  return store.offers[idx];
}

export async function deleteOffer(id: string) {
  const store = await readStore();
  const idx = store.offers.findIndex((o) => o._id === id);
  if (idx < 0) return false;
  store.offers.splice(idx, 1);
  await writeStore(store);
  return true;
}

// ---------------- Blog / Posts CRUD ----------------

export async function getAllPostsAdmin() {
  const store = await readStore();
  return store.posts;
}

export async function createPost(input: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
}) {
  const store = await readStore();
  const post = {
    _id: uid("post"),
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    isPublished: input.isPublished ?? true,
    createdAt: new Date().toISOString(),
  };
  store.posts.unshift(post);
  await writeStore(store);
  return post;
}

export async function updatePost(id: string, patch: Partial<StoreShape["posts"][number]>) {
  const store = await readStore();
  const idx = store.posts.findIndex((p) => p._id === id);
  if (idx < 0) return null;
  store.posts[idx] = { ...store.posts[idx], ...patch, _id: id };
  await writeStore(store);
  return store.posts[idx];
}

export async function deletePost(id: string) {
  const store = await readStore();
  const idx = store.posts.findIndex((p) => p._id === id);
  if (idx < 0) return false;
  store.posts.splice(idx, 1);
  await writeStore(store);
  return true;
}

// ---------------- Booking / Inquiries CRUD ----------------

export async function deleteBooking(id: string) {
  const store = await readStore();
  const idx = store.bookings.findIndex((b) => b._id === id);
  if (idx < 0) return false;
  store.bookings.splice(idx, 1);
  await writeStore(store);
  return true;
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
