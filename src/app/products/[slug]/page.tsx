import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ProductDetail } from "@/components/product-detail";
import { ensureDemoCatalog } from "@/lib/catalog";
import type { Product, Review } from "@/lib/types";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  await ensureDemoCatalog();
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) return { title: "Dish not found | Susurk" };
  return {
    title: `${product.name} | Susurk`,
    description: product.subtitle,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await ensureDemoCatalog();
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) notFound();

  const [productReviews, related] = await Promise.all([
    db.select().from(reviews).where(eq(reviews.productId, product.id)).orderBy(desc(reviews.createdAt)),
    db.select().from(products).where(ne(products.id, product.id)).orderBy(desc(products.isBestseller)).limit(4),
  ]);

  return <ProductDetail product={product as Product} reviews={productReviews as Review[]} relatedProducts={related as Product[]} />;
}
