import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/cart-item-model';
import { CartItemComponent } from '../cart-item/cart-item';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.scss'],
})
export class ShoppingCartComponent implements OnInit {
  // Injects the CartService to manage shopping cart state.
  private cartService = inject(CartService);

  // Observable stream of cart items, updates whenever the cart content changes.
  readonly cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
  // Observable stream of the total price of items in the cart.
  readonly totalPrice$: Observable<number> = this.cartService.getTotalPrice();
  // Observable stream of the total count of items (quantity sum) in the cart.
  readonly itemCount$: Observable<number> = this.cartService.getItemCount();

  // Lifecycle hook, called once after component initialization.
  ngOnInit(): void {}

  /**
   * Provides a tracking function for @for loops to optimize rendering performance.
   * @param index The index of the item.
   * @param item The CartItem object.
   * @returns A unique identifier for the item (product ID).
   */
  trackByProductId(index: number, item: CartItem): number {
    return item?.product?.id ?? index; // Uses product ID for tracking, falls back to index if ID is missing.
  }

  /**
   * Handles changes to an item's quantity in the cart.
   * Delegates the update operation to the CartService.
   * @param event An object containing the productId and the new quantity.
   */
  onQuantityChange(event: { productId: number; quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  /**
   * Handles removing an item from the cart.
   * Delegates the removal operation to the CartService.
   * @param productId The ID of the product to be removed.
   */
  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  /**
   * Clears all items from the shopping cart.
   * Prompts for user confirmation before proceeding.
   */
  onClearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }
}
