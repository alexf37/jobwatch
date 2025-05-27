import { db } from "@/server/db";

await db.listing.deleteMany();
