// Shared TypeScript types — used by both frontend forms/validation and backend models

export type BookingStatus = "pending" | "contacted" | "confirmed" | "cancelled";
export type UserRole = "owner" | "staff";

export interface IPackage {
  _id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  durationDays: number;
  price: number;
  category: string; // e.g. "honeymoon", "adventure", "family", "cultural"
  images: string[]; // Cloudinary/S3 URLs
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  excluded: string[];
  maxPax: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVehicle {
  _id: string;
  name: string;
  type: string; // e.g. "van", "sedan", "SUV", "bus"
  capacity: number;
  images: string[];
  features: string[]; // e.g. "AC", "WiFi", "Driver included"
  isActive: boolean;
}

export interface IOffer {
  _id: string;
  title: string;
  description: string;
  discountText: string; // e.g. "20% off" or "Free airport pickup"
  packageId?: string; // optional link to a specific package
  image: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface IReview {
  _id: string;
  customerName: string;
  rating: number; // 1–5
  comment: string;
  packageId?: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface IBooking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  packageId?: string;
  vehicleId?: string;
  travelDate: Date;
  paxCount: number;
  message?: string;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: Date;
}

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  isPublished: boolean;
  createdAt: Date;
}
