import { db } from "@/db";
import { products } from "@/db/schema";
import { Storefront } from "@/components/storefront";
import { ensureDemoCatalog } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureDemoCatalog();
  const catalog = (await db.select().from(products)) as Product[];

  return <Storefront products={catalog} />;
}
