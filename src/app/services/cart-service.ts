import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem } from '../models/cart-item-model';
import { Product } from '../models/product-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // A BehaviorSubject holds the current list of items in the cart.
  // It's used for state management, providing an observable stream.
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Public observable stream for components to subscribe to, receiving cart updates.
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {}

  /**
   * Retrieves the current snapshot of items in the cart.
   * @returns An array of CartItem objects.
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Adds a product to the cart or increments its quantity if it already exists.
   * @param product The product to add.
   */
  addToCart(product: Product): void {
    const currentItems = [...this.cartItemsSubject.value]; // Create a copy of current items.
    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id); // Check if product is already in cart.

    if (existingItemIndex !== -1) {
      // If product exists, increment its quantity.
      currentItems[existingItemIndex] = {
        ...currentItems[existingItemIndex],
        quantity: currentItems[existingItemIndex].quantity + 1,
      };
    } else {
      // If new product, add it to the cart with quantity 1.
      currentItems.push({ product, quantity: 1 });
    }

    this.cartItemsSubject.next(currentItems); // Emit the updated cart items.
  }

  /**
   * Removes a specific product from the cart.
   * @param productId The ID of the product to remove.
   */
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    // Filter out the item with the matching productId.
    const updatedItems = currentItems.filter((item) => item.product.id !== productId);
    this.cartItemsSubject.next(updatedItems); // Emit the updated cart.
  }

  /**
   * Updates the quantity of a specific product in the cart.
   * If quantity is 0 or less, the item is removed.
   * @param productId The ID of the product to update.
   * @param quantity The new quantity.
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId); // Remove item if quantity is zero or negative.
      return;
    }

    const currentItems = [...this.cartItemsSubject.value];
    const itemIndex = currentItems.findIndex((item) => item.product.id === productId);

    if (itemIndex !== -1) {
      // Update the quantity of the existing item.
      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: quantity,
      };
      this.cartItemsSubject.next(currentItems); // Emit the updated cart.
    }
  }

  /**
   * Calculates the total price of all items in the cart.
   * @returns An Observable emitting the total price.
   */
  getTotalPrice(): Observable<number> {
    return this.cartItems$.pipe(
      // Maps the stream of cart items to a single total price.
      map((items) => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
    );
  }

  /**
   * Calculates the total number of items (sum of quantities) in the cart.
   * @returns An Observable emitting the total item count.
   */
  getItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      // Maps the stream of cart items to a single total count.
      map((items) => items.reduce((sum, item) => sum + item.quantity, 0))
    );
  }

  /**
   * Clears all items from the shopping cart.
   */
  clearCart(): void {
    this.cartItemsSubject.next([]); // Emits an empty array, effectively clearing the cart.
  }
}
