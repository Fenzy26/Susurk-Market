"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-context";
import { Icon } from "@/components/ui-icons";
import { formatPrice } from "@/lib/money";

type OrderResult = { orderId: string; subtotal: number; deliveryFee: number; total: number };
type FormValues = { name: string; email: string; phone: string; street: string; city: string; postalCode: string; notes: string };

const initialForm: FormValues = { name: "", email: "", phone: "", street: "", city: "", postalCode: "", notes: "" };

export function CheckoutFlow() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [accepted, setAccepted] = useState(false);
  const deliveryFee = subtotal >= 3500 || subtotal === 0 ? 0 : 395;

  const updateForm = (field: keyof FormValues, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
        }),
      });
      const result = await response.json() as OrderResult & { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Something got in the way. Please check your details and try again.");
        return;
      }
      setOrder(result);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("We couldn’t reach the kitchen just now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="checkout-page">
      <div className="announcement-bar"><span className="announcement-sparkle">✳</span><span>Good food, good mood. <strong>Free delivery over $35.</strong></span><span className="announcement-right">Made fresh near you <span>·</span> Here in Silver Lake</span></div>
      <header className="checkout-header content-width">
        <Link href="/" className="brand" aria-label="Susurk home"><span className="brand-flower">✳</span><span className="brand-name">susurk</span><span className="brand-tagline">FOOD FAST TO ALL</span></Link>
        <div className="checkout-steps"><span className="checkout-step is-complete"><i>1</i> Your bag</span><span className="step-rule" /><span className="checkout-step is-current"><i>2</i> Your details</span><span className="step-rule" /><span className={`checkout-step${order ? " is-complete" : ""}`}><i>3</i> All yours</span></div>
        <div className="secure-note"><Icon name="check" size={15} /> Secure checkout</div>
      </header>

      {order ? (
        <section className="order-success content-width">
          <div className="success-flower">✳</div>
          <p className="eyebrow">THE GOOD STUFF IS ON ITS WAY</p>
          <h1>That’s dinner <em>sorted.</em></h1>
          <p className="success-copy">Thanks, {form.name.split(" ")[0] || "neighbor"}. Your kitchen crew is getting started, and your order should be at your door in about 25 minutes.</p>
          <div className="success-order-card"><span>YOUR ORDER NUMBER</span><strong>#{order.orderId.slice(0, 8).toUpperCase()}</strong><div><span>Total · pay your courier on arrival</span><strong>{formatPrice(order.total)}</strong></div></div>
          <div className="success-next"><span><Icon name="clock" size={20} /></span><p><strong>We’re making it fresh right now.</strong><small>We’ve sent the details to {form.email}. See you soon.</small></p></div>
          <Link href="/" className="button button-dark">Back to Susurk <Icon name="arrow-right" size={18} /></Link>
        </section>
      ) : items.length === 0 ? (
        <section className="checkout-empty content-width"><div className="empty-cart-mark"><Icon name="bag" size={29} /></div><p className="eyebrow">A LITTLE SOMETHING IS MISSING</p><h1>Your bag is <em>empty.</em></h1><p>Let’s find you something really good.</p><Link href="/" className="button button-dark">Browse the menu <Icon name="arrow-right" size={17} /></Link></section>
      ) : (
        <div className="checkout-content content-width">
          <div className="checkout-title"><p className="eyebrow">JUST A FEW LITTLE DETAILS</p><h1>Let’s get the good <em>stuff to you.</em></h1><Link href="/" className="checkout-back"><Icon name="arrow-right" size={15} /> Keep browsing</Link></div>
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={placeOrder}>
              <section className="checkout-form-section"><div className="form-section-heading"><span>01</span><div><h2>Who’s hungry?</h2><p>Just the essentials. We promise.</p></div></div><div className="form-fields two-columns"><label className="field-label">Your name<input required minLength={2} maxLength={120} autoComplete="name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Jamie Rivera" /></label><label className="field-label">Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="jamie@email.com" /></label><label className="field-label field-full">Mobile number<input required type="tel" minLength={7} autoComplete="tel" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="(323) 555-0142" /></label></div></section>
              <section className="checkout-form-section"><div className="form-section-heading"><span>02</span><div><h2>Where should we find you?</h2><p>We’ll bring it right to your door.</p></div></div><div className="form-fields two-columns"><label className="field-label field-full">Street address<input required minLength={5} maxLength={180} autoComplete="street-address" value={form.street} onChange={(event) => updateForm("street", event.target.value)} placeholder="1234 Sunset Boulevard, Apt 2" /></label><label className="field-label">City<input required minLength={2} autoComplete="address-level2" value={form.city} onChange={(event) => updateForm("city", event.target.value)} placeholder="Los Angeles" /></label><label className="field-label">ZIP code<input required minLength={3} maxLength={24} autoComplete="postal-code" value={form.postalCode} onChange={(event) => updateForm("postalCode", event.target.value)} placeholder="90026" /></label><label className="field-label field-full">Delivery note <span className="field-optional">Optional</span><textarea maxLength={500} rows={3} value={form.notes} onChange={(event) => updateForm("notes", event.target.value)} placeholder="Gate code, where to leave it, or a little note for your courier..." /></label></div></section>
              <section className="checkout-form-section payment-section"><div className="form-section-heading"><span>03</span><div><h2>One last thing</h2><p>Payment, the easy part.</p></div></div><label className="payment-choice"><span className="payment-radio"><input type="radio" name="payment" checked readOnly /><i /></span><span className="payment-choice-icon">$</span><span className="payment-choice-copy"><strong>Pay your courier on arrival</strong><small>Cash or card — whatever works for you.</small></span><Icon name="check" size={17} /></label></section>
              <label className="terms-choice"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} required /><span>I’ve checked everything and I’m ready for something delicious.</span></label>
              {error && <div className="checkout-error" role="alert"><Icon name="sparkle" size={17} /> {error}</div>}
              <button type="submit" disabled={isSubmitting || !accepted} className="button button-dark checkout-submit">{isSubmitting ? "Making it happen…" : "Place my order"}<span>{formatPrice(subtotal + deliveryFee)}</span>{!isSubmitting && <Icon name="arrow-right" size={18} />}</button>
              <p className="checkout-footnote"><Icon name="check" size={14} /> No payment is taken now. Your courier will take care of it.</p>
            </form>

            <aside className="checkout-summary"><div className="summary-heading"><div><p className="eyebrow">THE GOOD STUFF</p><h2>Your bag <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div><Link href="/" aria-label="Edit your bag">Edit</Link></div><div className="checkout-items">{items.map(({ product, quantity }) => <div className="checkout-item" key={product.id}><div className="checkout-item-image" style={{ backgroundImage: `url("${product.images[0]}")` }} /><div className="checkout-item-copy"><strong>{product.name}</strong><small>Qty {quantity} · {product.category}</small></div><span>{formatPrice(product.price * quantity)}</span></div>)}</div><div className="checkout-delivery-hint"><Icon name="truck" size={17} /><span>{subtotal >= 3500 ? "You’ve unlocked free delivery. Lovely." : `Add ${formatPrice(3500 - subtotal)} more for free delivery.`}</span></div><div className="checkout-totals"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Delivery</span><strong>{deliveryFee ? formatPrice(deliveryFee) : "On us"}</strong></div><div className="checkout-total-line"><span>Total <small>· pay on arrival</small></span><strong>{formatPrice(subtotal + deliveryFee)}</strong></div></div><div className="summary-promise"><span>✳</span><p><strong>Made fresh, packed with care.</strong><small>Every single order, every single time.</small></p></div></aside>
          </div>
        </div>
      )}
      <footer className="checkout-footer content-width"><Link href="/" className="text-link">← Back to Susurk</Link><span>Questions? <a href="mailto:hello@susurk.com">We’re right here.</a></span><span>© 2025 Susurk Kitchen</span></footer>
    </main>
  );
}
