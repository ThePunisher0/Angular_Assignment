import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem } from '../models/cart-item-model';
import { Product } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product): void {
    const currentItems = [...this.cartItemsSubject.value];
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex] = {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + 1
      };
    } else {
      currentItems.push({ product, quantity: 1 });
    }

    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.cartItemsSubject.value];
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: quantity
      };
      this.cartItemsSubject.next(currentItems);
    }
  }

  getTotalPrice(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
    );
  }

  getItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}