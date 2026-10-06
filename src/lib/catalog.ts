import { db } from "@/db";
import { demoProducts, demoReviews } from "@/lib/demo-data";
import { products, reviews } from "@/db/schema";

export async function ensureDemoCatalog() {
  await db.insert(products).values(demoProducts).onConflictDoNothing();
  await db.insert(reviews).values(demoReviews).onConflictDoNothing();
}
