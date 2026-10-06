import { randomUUID } from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

type CheckoutItem = { productId: string; quantity: number };

function cleanText(value: unknown, maxLength = 180) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please check your details and try again." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Please check your details and try again." }, { status: 400 });
  }

  const details = body as Record<string, unknown>;
  const customerName = cleanText(details.name, 120);
  const email = cleanText(details.email, 200).toLowerCase();
  const phone = cleanText(details.phone, 40);
  const street = cleanText(details.street, 180);
  const city = cleanText(details.city, 100);
  const postalCode = cleanText(details.postalCode, 24);
  const notes = cleanText(details.notes, 500);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (customerName.length < 2 || !emailIsValid || phone.length < 7 || street.length < 5 || city.length < 2 || postalCode.length < 3) {
    return Response.json({ error: "Please enter a valid name, email, phone, and complete delivery address." }, { status: 400 });
  }

  if (!Array.isArray(details.items) || details.items.length < 1 || details.items.length > 30) {
    return Response.json({ error: "Your bag is empty. Add a few good things before checking out." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const rawItem of details.items) {
    if (!rawItem || typeof rawItem !== "object") {
      return Response.json({ error: "One of the items in your bag needs a refresh. Please reload and try again." }, { status: 400 });
    }
    const item = rawItem as Partial<CheckoutItem>;
    if (typeof item.productId !== "string" || !item.productId || !Number.isInteger(item.quantity) || !item.quantity || item.quantity < 1 || item.quantity > 20) {
      return Response.json({ error: "Please check the quantities in your bag and try again." }, { status: 400 });
    }
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  if ([...quantities.values()].some((quantity) => quantity > 20)) {
    return Response.json({ error: "Please order no more than 20 of any one dish." }, { status: 400 });
  }

  const productIds = [...quantities.keys()];
  const catalog = await db.select().from(products).where(inArray(products.id, productIds));
  if (catalog.length !== productIds.length) {
    return Response.json({ error: "One of those dishes is no longer on the menu. Please refresh your bag." }, { status: 400 });
  }

  const subtotal = catalog.reduce((sum, product) => sum + product.price * (quantities.get(product.id) ?? 0), 0);
  const deliveryFee = subtotal >= 3500 ? 0 : 395;
  const total = subtotal + deliveryFee;
  const orderId = randomUUID();

  await db.transaction(async (transaction) => {
    await transaction.insert(orders).values({
      id: orderId,
      customerName,
      email,
      phone,
      street,
      city,
      postalCode,
      notes: notes || null,
      subtotal,
      deliveryFee,
      total,
      status: "confirmed",
    });

    await transaction.insert(orderItems).values(
      catalog.map((product) => ({
        id: randomUUID(),
        orderId,
        productId: product.id,
        productName: product.name,
        quantity: quantities.get(product.id) ?? 1,
        unitPrice: product.price,
      })),
    );
  });

  return Response.json({ orderId, subtotal, deliveryFee, total }, { status: 201 });
}
