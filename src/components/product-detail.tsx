"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Icon } from "@/components/ui-icons";
import { formatPrice } from "@/lib/money";
import type { Product, Review } from "@/lib/types";

export function ProductDetail({ product, reviews, relatedProducts }: { product: Product; reviews: Review[]; relatedProducts: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const { addItem, itemCount, openCart } = useCart();

  return (
    <main className="detail-page">
      <div className="announcement-bar detail-announcement"><span className="announcement-sparkle">✳</span><span>Good food, good mood. <strong>Free delivery over $35.</strong></span><span className="announcement-right">Made fresh near you <span>·</span> Here in Silver Lake</span></div>
      <header className="detail-header"><div className="detail-header-inner content-width">
        <Link href="/" className="brand" aria-label="Susurk home"><span className="brand-flower">✳</span><span className="brand-name">susurk</span><span className="brand-tagline">FOOD FAST TO ALL</span></Link>
        <Link href="/#menu" className="detail-back"><Icon name="arrow-right" size={16} /> <span>Back to the good stuff</span></Link>
        <button className="bag-button" onClick={openCart} aria-label={`Open shopping bag with ${itemCount} items`}><span className="bag-button-label">Your bag</span><span className="bag-icon-wrap"><Icon name="bag" size={19} /><span className="bag-count">{itemCount}</span></span></button>
      </div></header>

      <div className="content-width product-detail-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><Icon name="chevron-right" size={14} /><Link href="/#menu">Menu</Link><Icon name="chevron-right" size={14} /><span>{product.name}</span></nav>
        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="detail-main-image" role="img" aria-label={product.name} style={{ backgroundImage: `url("${product.images[activeImage]}")` }}>
              {product.badge && <span className="detail-image-badge">✳ {product.badge}</span>}
              <span className="detail-gallery-count">0{activeImage + 1} <span>/</span> 0{product.images.length}</span>
            </div>
            <div className="gallery-thumbnails" aria-label="Choose product image">
              {product.images.map((image, index) => <button key={image} className={`gallery-thumbnail${activeImage === index ? " is-active" : ""}`} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={activeImage === index} style={{ backgroundImage: `url("${image}")` }} />)}
            </div>
            <div className="gallery-note"><Icon name="sparkle" size={16} /><span>Made fresh when you order. Always.</span></div>
          </div>

          <div className="product-detail-copy">
            <div className="detail-category-line"><span className="detail-category-dot" /> {product.category.toUpperCase()} <span className="detail-prep"><Icon name="clock" size={15} /> ABOUT {product.prepTime} MINUTES</span></div>
            <h1>{product.name}<span className="detail-heading-period">.</span></h1>
            <p className="detail-subtitle">{product.subtitle}</p>
            <div className="detail-rating-line"><span className="detail-stars" aria-label={`Rated ${product.rating} out of 5`}>★★★★★</span><strong>{product.rating.toFixed(1)}</strong><span className="rating-divider">·</span><a href="#product-reviews">{product.reviewCount} neighbor reviews</a></div>
            <div className="detail-price-line"><strong>{formatPrice(product.price)}</strong>{product.compareAtPrice && <del>{formatPrice(product.compareAtPrice)}</del>}{product.compareAtPrice && <span className="detail-saving">A little something off</span>}</div>
            <p className="detail-description">{product.description}</p>
            <div className="dietary-tags">{product.dietary.map((tag) => <span key={tag}><Icon name="leaf" size={14} /> {tag}</span>)}</div>
            <div className="detail-add-row">
              <div className="quantity-control detail-quantity" aria-label="Select quantity"><button onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><Icon name="minus" size={16} /></button><span aria-live="polite">{quantity}</span><button onClick={() => setQuantity((current) => Math.min(99, current + 1))} aria-label="Increase quantity"><Icon name="plus" size={16} /></button></div>
              <button className="button button-dark detail-add-button" onClick={() => addItem(product, quantity)}>Add to your bag <span>{formatPrice(product.price * quantity)}</span><Icon name="arrow-right" size={17} /></button>
              <button className={`detail-favorite${favorite ? " is-favorite" : ""}`} onClick={() => setFavorite((value) => !value)} aria-label={favorite ? "Remove from favorites" : "Save to favorites"} aria-pressed={favorite}><Icon name="heart" filled={favorite} size={20} /></button>
            </div>
            <div className="detail-perks"><div><span><Icon name="truck" size={17} /></span><p><strong>Fast, free delivery</strong><small>On orders over $35</small></p></div><div><span><Icon name="sparkle" size={17} /></span><p><strong>Always made to order</strong><small>Fresh from our kitchen</small></p></div></div>
            <details className="ingredient-details" open><summary>What’s inside <Icon name="plus" size={16} /></summary><p>{product.ingredients.join(" · ")}</p></details>
            <details className="ingredient-details"><summary>A note from our kitchen <Icon name="plus" size={16} /></summary><p>We work with seasonal produce and make this dish fresh for every order. Ingredient availability can change a little with the seasons. Have an allergy? Get in touch before ordering and our kitchen team will help.</p></details>
          </div>
        </div>

        <section className="reviews-section" id="product-reviews">
          <div className="reviews-heading"><div><p className="eyebrow">GOOD THINGS GET TALKED ABOUT</p><h2>Notes from the <em>neighborhood.</em></h2></div><div className="reviews-score"><span>★★★★★</span><strong>{product.rating.toFixed(1)}</strong><small>from {product.reviewCount} neighbor reviews</small></div></div>
          <div className="review-grid">{reviews.length ? reviews.map((review) => <article className="review-card" key={review.id}><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>★★★★★</div><h3>“{review.title}”</h3><p>{review.body}</p><div className="review-author"><span className="review-avatar">{review.customerName.charAt(0)}</span><span><strong>{review.customerName}</strong><small>{review.neighborhood} · Verified order</small></span><Icon name="check" size={15} /></div></article>) : <p className="no-review-copy">No notes just yet — you could be the first neighbor to try it.</p>}</div>
        </section>

        {relatedProducts.length > 0 && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">WHILE YOU’RE HERE</p><h2>A few more <em>good things.</em></h2></div><Link className="text-link" href="/#menu">See the whole menu <Icon name="arrow-right" size={17} /></Link></div><div className="related-grid">{relatedProducts.slice(0, 4).map((item) => <article className="related-card" key={item.id}><Link href={`/products/${item.slug}`} className="related-photo" style={{ backgroundImage: `url("${item.images[0]}")` }} aria-label={`View ${item.name}`} /><div><Link href={`/products/${item.slug}`}><strong>{item.name}</strong></Link><span>{formatPrice(item.price)}</span></div><p>{item.subtitle}</p></article>)}</div></section>}
      </div>
      <footer className="detail-footer"><Link href="/" className="brand"><span className="brand-flower">✳</span><span className="brand-name">susurk</span></Link><span>Good food should get around.</span><Link href="/#menu" className="text-link">Back to the menu <Icon name="arrow-right" size={16} /></Link></footer>
    </main>
  );
}
