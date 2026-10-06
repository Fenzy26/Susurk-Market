"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatPrice } from "@/lib/money";
import type { CartLine, Product } from "@/lib/types";
import { Icon } from "@/components/ui-icons";

const STORAGE_KEY = "susurk-cart-v1";

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [] as CartLine[];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [] as CartLine[];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        "product" in line &&
        "quantity" in line &&
        typeof line.quantity === "number" &&
        Number.isFinite(line.quantity) &&
        line.quantity > 0 &&
        typeof line.product === "object" &&
        line.product !== null &&
        "id" in line.product &&
        typeof line.product.id === "string",
    );
  } catch {
    return [] as CartLine[];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart continues to work for this session if browser storage is unavailable.
    }
  }, [items, hasLoaded]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setItems(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const amount = Math.max(1, Math.min(99, Math.floor(quantity)));
    setItems((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (!existing) return [...current, { product, quantity: amount }];
      return current.map((line) =>
        line.product.id === product.id
          ? { ...line, product, quantity: Math.min(99, line.quantity + amount) }
          : line,
      );
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((line) => line.product.id !== productId));
      return;
    }
    setItems((current) =>
      current.map((line) =>
        line.product.id === productId
          ? { ...line, quantity: Math.min(99, Math.floor(quantity)) }
          : line,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((line) => line.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
    return {
      items,
      itemCount: items.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, isOpen, addItem, updateQuantity, removeItem, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const deliveryFee = subtotal >= 3500 ? 0 : items.length ? 395 : 0;
  const amountToFreeDelivery = Math.max(0, 3500 - subtotal);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  return (
    <div className={`cart-layer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      <button
        className="cart-scrim"
        onClick={closeCart}
        aria-label="Close shopping bag"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your shopping bag">
        <div className="cart-drawer-head">
          <div>
            <p className="eyebrow">Your good stuff</p>
            <h2>Your bag <span>({itemCount})</span></h2>
          </div>
          <button className="icon-button cart-close" onClick={closeCart} aria-label="Close bag">
            <Icon name="close" />
          </button>
        </div>
        {items.length > 0 ? (
          <>
            <div className="delivery-progress">
              <p>
                {amountToFreeDelivery > 0 ? (
                  <>You’re <strong>{formatPrice(amountToFreeDelivery)}</strong> away from free delivery</>
                ) : (
                  <><strong>Lovely!</strong> Your delivery is on us.</>
                )}
              </p>
              <div className="progress-track"><span style={{ width: `${Math.min(100, (subtotal / 3500) * 100)}%` }} /></div>
            </div>
            <div className="cart-lines">
              {items.map(({ product, quantity }) => (
                <div className="cart-line" key={product.id}>
                  <div className="cart-line-image" style={{ backgroundImage: `url("${product.images[0]}")` }} role="img" aria-label={product.name} />
                  <div className="cart-line-copy">
                    <div className="cart-line-top">
                      <div>
                        <span className="cart-category">{product.category}</span>
                        <h3>{product.name}</h3>
                      </div>
                      <span className="cart-line-price">{formatPrice(product.price * quantity)}</span>
                    </div>
                    <div className="cart-line-bottom">
                      <div className="quantity-control quantity-control-small" aria-label={`Quantity of ${product.name}`}>
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label="Decrease quantity"><Icon name="minus" size={14} /></button>
                        <span>{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label="Increase quantity"><Icon name="plus" size={14} /></button>
                      </div>
                      <button className="remove-item" onClick={() => removeItem(product.id)}><Icon name="trash" size={15} /> Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="summary-row"><span>Delivery</span><strong>{deliveryFee === 0 ? "On us" : formatPrice(deliveryFee)}</strong></div>
              <p className="cart-tiny-note">Taxes calculated at checkout. Always packed with care.</p>
              <Link className="button button-dark button-full checkout-link" href="/checkout" onClick={closeCart}>
                Make it yours <Icon name="arrow-right" size={18} />
              </Link>
              <button className="continue-shopping" onClick={closeCart}>Keep looking around</button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-mark"><Icon name="bag" size={29} /></div>
            <h3>Your bag is taking a little breather.</h3>
            <p>Fill it with something fresh, delicious, and very much worth the wait (which won’t be long).</p>
            <button className="button button-dark" onClick={closeCart}>Find your favorites <Icon name="arrow-right" size={17} /></button>
          </div>
        )}
      </aside>
    </div>
  );
}
