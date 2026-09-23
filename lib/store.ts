import { promises as fs } from "fs";
import path from "path";
import { packages, vehicles, offers, reviews, posts, seedBookings } from "./catalog";
import type { BookingStatus } from "@/schemas/types";

export type StoreShape = {
  packages: typeof packages;
  vehicles: typeof vehicles;
  offers: typeof offers;
  reviews: Array<(typeof reviews)[number] & { isApproved: boolean }>;
  posts: typeof posts;
  bookings: Array<{
    _id: string;
    customerName: string;
    email: string;
    phone: string;
    packageId?: string;
    vehicleId?: string;
    travelDate: string;
    paxCount: number;
    message?: string;
    status: BookingStatus;
    adminNotes?: string;
    createdAt: string;
  }>;
};

const filePath = path.join(process.cwd(), "data", "runtime-store.json");

function seed(): StoreShape {
  return {
    packages: structuredClone(packages),
    vehicles: structuredClone(vehicles),
    offers: structuredClone(offers),
    reviews: structuredClone(reviews),
    posts: structuredClone(posts),
    bookings: structuredClone(seedBookings),
  };
}

async function ensure() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(seed(), null, 2), "utf8");
  }
}

export async function readStore(): Promise<StoreShape> {
  await ensure();
  const raw = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(raw) as StoreShape;
  } catch {
    const fresh = seed();
    await fs.writeFile(filePath, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

export async function writeStore(next: StoreShape) {
  await ensure();
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
