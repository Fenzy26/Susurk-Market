"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Icon } from "@/components/ui-icons";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/types";

const categories = ["All dishes", "Bowls", "Handhelds", "Mains", "Sides", "Sweets", "Sips"];
const heroImage =
  "https://images.pexels.com/photos/9213873/pexels-photo-9213873.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1500";

type SortOption = "featured" | "price-low" | "price-high" | "rating";

export function Storefront({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("All dishes");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [search, setSearch] = useState("");
  const [plantBasedOnly, setPlantBasedOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addItem } = useCart();

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "All dishes" || product.category === activeCategory;
      const matchesDiet = !plantBasedOnly || product.dietary.some((tag) => tag === "Vegan" || tag === "Vegetarian");
      const matchesQuery = !query || [product.name, product.subtitle, product.category, ...product.dietary]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesCategory && matchesDiet && matchesQuery;
    });

    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
    if (sortBy === "featured") filtered.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
    return filtered;
  }, [products, activeCategory, sortBy, search, plantBasedOnly]);

  const chooseCollection = (category: string) => {
    setActiveCategory(category);
    setSearch("");
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="storefront">
      <div className="announcement-bar">
        <span className="announcement-sparkle">✳</span>
        <span>Good food, good mood. <strong>Free delivery over $35.</strong></span>
        <span className="announcement-right">Made fresh near you <span>·</span> Here in Silver Lake</span>
      </div>
      <StoreHeader search={search} setSearch={setSearch} />

      <section className="hero-section content-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEIGHBORHOOD, WITH BETTER LUNCH</p>
          <h1 id="hero-title">Good food.<br /><em>Moving fast.</em></h1>
          <p className="hero-description">Really good things from really good neighborhood kitchens. Made fresh, packed with care, and at your door before you can decide what to watch.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#menu">Find your new favorite <Icon name="arrow-right" size={18} /></a>
            <a className="hero-secondary" href="#how-it-works">How we do it <Icon name="arrow-down" size={16} /></a>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>K</span></div>
            <div><div className="tiny-stars" aria-label="Rated 4.9 out of 5">★★★★★</div><p>Loved by your neighbors <strong>and counting</strong></p></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo" role="img" aria-label="Fresh Mediterranean lunch bowls ready to share" style={{ backgroundImage: `url("${heroImage}")` }}>
            <div className="photo-grain" />
          </div>
          <div className="hero-photo-stamp"><span>FRESH<br />FROM<br />OUR KITCHEN</span><span className="stamp-star">✳</span></div>
          <div className="floating-delivery-card"><span className="delivery-icon"><Icon name="truck" size={20} /></span><span><strong>At your door in</strong><small>about 25 minutes</small></span><span className="delivery-card-dot" /></div>
          <div className="floating-food-card"><div className="mini-food-photo" style={{ backgroundImage: `url("${products[0]?.images[0] ?? heroImage}")` }} /><div><strong>The Green Goddess</strong><small>the neighborhood favorite</small></div><span>{products[0] ? formatPrice(products[0].price) : "$15.90"}</span></div>
        </div>
      </section>

      <div className="value-strip content-width" id="how-it-works">
        <div className="value-item"><span className="value-icon"><Icon name="sparkle" size={20} /></span><span><strong>Made when you order</strong><small>No sad, sitting-around food.</small></span></div>
        <div className="value-item"><span className="value-icon"><Icon name="leaf" size={20} /></span><span><strong>Good things, sourced well</strong><small>Local growers. Better ingredients.</small></span></div>
        <div className="value-item"><span className="value-icon"><Icon name="clock" size={20} /></span><span><strong>On its way in 25 minutes</strong><small>Fast, but never rushed.</small></span></div>
      </div>

      <section className="collections-section content-width" aria-labelledby="collections-title">
        <div className="section-heading collections-heading">
          <div><p className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</p><h2 id="collections-title">What sounds <em>good?</em></h2></div>
          <p>Good days have all kinds of appetites. Start with a mood.</p>
        </div>
        <div className="collection-grid">
          <CollectionCard image={products.find((product) => product.id === "green-goddess-bowl")?.images[0] ?? heroImage} number="01" title="The feel-good" subtitle="Bowls & bright things" category="Bowls" onChoose={chooseCollection} tone="green" />
          <CollectionCard image={products.find((product) => product.id === "crispy-chicken-sandwich")?.images[0] ?? heroImage} number="02" title="The big bite" subtitle="Handhelds & mains" category="Handhelds" onChoose={chooseCollection} tone="peach" />
          <CollectionCard image={products.find((product) => product.id === "brown-butter-cookies")?.images[0] ?? heroImage} number="03" title="The little treat" subtitle="Sweets & sips" category="Sweets" onChoose={chooseCollection} tone="butter" />
        </div>
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="content-width">
          <div className="section-heading menu-heading">
            <div><p className="eyebrow">A FEW VERY GOOD REASONS TO STAY IN</p><h2 id="menu-title">Meet your next <em>favorite.</em></h2></div>
            <p>Little-batch cooking, big-time flavor. Everything is made fresh around the corner.</p>
          </div>
          <div className="filter-bar">
            <div className="category-filter" role="tablist" aria-label="Filter dishes by category">
              {categories.map((category) => (
                <button key={category} role="tab" aria-selected={activeCategory === category} className={`category-chip${activeCategory === category ? " is-active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>
              ))}
            </div>
            <div className="filter-controls">
              <label className={`plant-toggle${plantBasedOnly ? " is-active" : ""}`}>
                <input type="checkbox" checked={plantBasedOnly} onChange={(event) => setPlantBasedOnly(event.target.checked)} />
                <Icon name="leaf" size={16} /> Plant based
              </label>
              <label className="sort-label" htmlFor="sort-products">Sort <span aria-hidden="true">·</span></label>
              <select id="sort-products" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
                <option value="featured">Our favorites</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="menu-result-line"><span>{search ? <>Showing results for <strong>“{search}”</strong></> : activeCategory === "All dishes" ? "The whole delicious lineup" : activeCategory}</span><span>{visibleProducts.length} {visibleProducts.length === 1 ? "good thing" : "good things"}</span></div>
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  favorite={favorites.includes(product.id)}
                  onFavorite={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])}
                  onAdd={() => addItem(product)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results"><span className="no-results-flower">✳</span><h3>Nothing on the menu just yet.</h3><p>Try a different search, or take a peek at all the good things.</p><button className="button button-dark" onClick={() => { setActiveCategory("All dishes"); setSearch(""); setPlantBasedOnly(false); }}>Show me everything</button></div>
          )}
          <div className="menu-bottom-note"><span>✳</span> Freshly made in our neighborhood kitchens. Always.</div>
        </div>
      </section>

      <section className="story-section content-width" id="our-story">
        <div className="story-photo-wrap">
          <div className="story-photo" role="img" aria-label="Fresh ingredients and colorful greens on a kitchen table" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85")` }} />
          <div className="story-photo-caption"><span className="caption-dot" /> FROM OUR LITTLE KITCHEN</div>
          <div className="story-roundel"><span>GOOD FOOD<br />SHOULD FEEL<br />LIKE GOOD NEWS</span><span>✳</span></div>
        </div>
        <div className="story-copy">
          <p className="eyebrow">A LITTLE MORE HEART IN EVERY BITE</p>
          <h2>Fast food can<br />feel <em>really good.</em></h2>
          <p>We started Susurk for the days when your fridge is uninspiring, your calendar is full, and a sad desk lunch is absolutely not the answer.</p>
          <p>So we got together with the neighborhood cooks we love, found the good growers down the road, and made a promise: real food, made fresh, brought to you with a little more care.</p>
          <a className="text-link" href="#reviews">A little more about us <Icon name="arrow-right" size={17} /></a>
          <div className="story-signoff"><span className="signature-mark">S.</span><span>With love, from our kitchen<br /><strong>The Susurk crew</strong></span></div>
        </div>
      </section>

      <section className="quote-section" id="reviews">
        <div className="quote-inner content-width">
          <div className="quote-side-note"><span>THE NEIGHBORHOOD<br />LOVES A GOOD BITE</span><span className="quote-flower">✳</span></div>
          <div className="quote-main"><div className="quote-stars" aria-label="Five star review">★★★★★</div><blockquote>“This is the first delivery app where the food arrives looking like someone <em>actually cared.</em>”</blockquote><p>JAMIE R. <span>·</span> SILVER LAKE REGULAR</p></div>
          <div className="quote-mark" aria-hidden="true">“</div>
        </div>
      </section>

      <section className="newsletter-section content-width">
        <div><p className="eyebrow">A GOOD THING IN YOUR INBOX</p><h2>First dibs on the <em>good stuff.</em></h2><p>New dishes, neighborhood news, and the occasional cookie drop. No weird stuff.</p></div>
        <NewsletterForm />
      </section>
      <StoreFooter />
    </main>
  );
}

function StoreHeader({ search, setSearch }: { search: string; setSearch: (search: string) => void }) {
  const { itemCount, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="site-header">
      <div className="header-inner content-width">
        <button className="mobile-menu-button icon-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}><Icon name={menuOpen ? "close" : "menu"} /></button>
        <Link href="/" className="brand" aria-label="Susurk home"><span className="brand-flower">✳</span><span className="brand-name">susurk</span><span className="brand-tagline">FOOD FAST TO ALL</span></Link>
        <nav className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
          <a href="#menu" onClick={() => setMenuOpen(false)}>The menu</a>
          <a href="#our-story" onClick={() => setMenuOpen(false)}>Our kind of food</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
        </nav>
        <div className="header-actions">
          <button className={`search-toggle icon-button${searchOpen ? " is-active" : ""}`} onClick={() => { setSearchOpen((open) => !open); if (searchOpen) setSearch(""); }} aria-label={searchOpen ? "Close search" : "Search menu"}><Icon name={searchOpen ? "close" : "search"} size={19} /></button>
          <button className="bag-button" onClick={openCart} aria-label={`Open shopping bag with ${itemCount} items`}><span className="bag-button-label">Your bag</span><span className="bag-icon-wrap"><Icon name="bag" size={19} /><span className="bag-count">{itemCount}</span></span></button>
        </div>
      </div>
      {searchOpen && <div className="search-row content-width"><Icon name="search" size={19} /><input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a dish, an ingredient, a craving..." aria-label="Search dishes" /><button onClick={() => { setSearch(""); searchRef.current?.focus(); }}>Clear</button></div>}
    </header>
  );
}

function CollectionCard({ image, number, title, subtitle, category, tone, onChoose }: { image: string; number: string; title: string; subtitle: string; category: string; tone: string; onChoose: (category: string) => void }) {
  return (
    <button className={`collection-card collection-${tone}`} onClick={() => onChoose(category)}>
      <span className="collection-number">{number} / A GOOD PLACE TO START</span>
      <span className="collection-image" style={{ backgroundImage: `url("${image}")` }} />
      <span className="collection-bottom"><span><strong>{title}</strong><small>{subtitle}</small></span><span className="collection-arrow"><Icon name="arrow-right" size={19} /></span></span>
    </button>
  );
}

function ProductCard({ product, index, favorite, onFavorite, onAdd }: { product: Product; index: number; favorite: boolean; onFavorite: () => void; onAdd: () => void }) {
  return (
    <article className="product-card" style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}>
      <div className="product-image-frame">
        <Link className="product-image" href={`/products/${product.slug}`} style={{ backgroundImage: `url("${product.images[0]}")` }} aria-label={`View ${product.name}`}>
          {product.badge && <span className="product-badge">{product.badge}</span>}
        </Link>
        <button className={`favorite-button${favorite ? " is-favorite" : ""}`} onClick={onFavorite} aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`} aria-pressed={favorite}><Icon name="heart" filled={favorite} size={18} /></button>
        <span className="prep-time"><Icon name="clock" size={14} /> {product.prepTime} min</span>
      </div>
      <div className="product-info">
        <div className="product-topline"><span className="product-category">{product.category}</span><span className="product-rating"><Icon name="star" filled size={13} /> {product.rating.toFixed(1)} <span>({product.reviewCount})</span></span></div>
        <Link href={`/products/${product.slug}`} className="product-name-link"><h3>{product.name}</h3></Link>
        <p className="product-subtitle">{product.subtitle}</p>
        <div className="product-card-bottom"><div className="product-price-wrap"><span className="product-price">{formatPrice(product.price)}</span>{product.compareAtPrice && <del>{formatPrice(product.compareAtPrice)}</del>}</div><button className="add-product-button" onClick={onAdd} aria-label={`Add ${product.name} to bag`}><Icon name="plus" size={18} /><span>Add</span></button></div>
      </div>
    </article>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); if (email.trim()) setSubmitted(true); }}>
      {submitted ? (
        <div className="newsletter-success"><span><Icon name="check" size={18} /></span><div><strong>You’re on the list.</strong><small>The good stuff is headed your way.</small></div></div>
      ) : (
        <><label htmlFor="newsletter-email" className="sr-only">Your email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" aria-label="Sign up for the newsletter"><Icon name="arrow-right" size={19} /></button><small>By signing up, you agree to receive occasional notes from Susurk.</small></>
      )}
    </form>
  );
}

function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="content-width footer-main">
        <div className="footer-brand-block"><Link href="/" className="brand footer-brand"><span className="brand-flower">✳</span><span className="brand-name">susurk</span><span className="brand-tagline">FOOD FAST TO ALL</span></Link><p>Good food, made fresh around the corner, and brought to you with a little more care.</p><a className="footer-location" href="https://maps.google.com/?q=Silver+Lake+Los+Angeles"><Icon name="pin" size={16} /> Silver Lake, Los Angeles</a></div>
        <div className="footer-links"><div><strong>Hungry?</strong><a href="#menu">Browse the menu</a><a href="#menu">Our favorites</a><a href="#menu">Something sweet</a></div><div><strong>Here to help</strong><a href="mailto:hello@susurk.com">Get in touch</a><a href="#how-it-works">Delivery details</a><a href="#our-story">Our story</a></div><div><strong>Come say hi</strong><a href="https://instagram.com">Instagram <span>↗</span></a><a href="https://tiktok.com">TikTok <span>↗</span></a></div></div>
      </div>
      <div className="content-width footer-bottom"><span>© 2025 Susurk Kitchen. Made with a little extra love.</span><span>Good food should get around.</span></div>
    </footer>
  );
}
