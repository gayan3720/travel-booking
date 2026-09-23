// Run once: npx ts-node scripts/seed-admin.ts
// Creates the first admin (owner) user. Do NOT expose a public signup route.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "../schemas/models";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const passwordHash = await bcrypt.hash("changeme123", 10);
  await AdminUser.create({
    name: "Owner",
    email: "owner@youragency.com",
    passwordHash,
    role: "owner",
  });

  console.log("Admin user created. Change the password after first login.");
  process.exit(0);
}

seed();
