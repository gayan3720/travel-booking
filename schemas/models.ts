import { Schema, model, models } from "mongoose";

// ---------------- Package ----------------
const PackageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    destination: { type: String, required: true, index: true },
    durationDays: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
      },
    ],
    included: [{ type: String }],
    excluded: [{ type: String }],
    maxPax: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ---------------- Vehicle ----------------
const VehicleSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    capacity: { type: Number, required: true },
    images: [{ type: String }],
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ---------------- Offer ----------------
const OfferSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountText: { type: String, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package" },
    image: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ---------------- Review ----------------
const ReviewSchema = new Schema(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package" },
    isApproved: { type: Boolean, default: false }, // moderation gate
  },
  { timestamps: true }
);

// ---------------- Booking (Inquiry) ----------------
const BookingSchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package" },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    travelDate: { type: Date, required: true },
    paxCount: { type: Number, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "contacted", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

// ---------------- Admin User ----------------
const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner", "staff"], default: "staff" },
  },
  { timestamps: true }
);

// ---------------- Blog Post ----------------
const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent model overwrite errors in Next.js dev (hot reload)
export const Package = models.Package || model("Package", PackageSchema);
export const Vehicle = models.Vehicle || model("Vehicle", VehicleSchema);
export const Offer = models.Offer || model("Offer", OfferSchema);
export const Review = models.Review || model("Review", ReviewSchema);
export const Booking = models.Booking || model("Booking", BookingSchema);
export const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
