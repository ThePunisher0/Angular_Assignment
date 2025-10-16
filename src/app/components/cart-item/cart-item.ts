import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cart-item-model';
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.html',
  styleUrls: ['./cart-item.scss'],
})
export class CartItemComponent {
  // Receives a CartItem object from the parent component.
  @Input({ required: true }) cartItem!: CartItem;

  // Emits an event when the item's quantity changes.
  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();

  // Emits an event when the item should be removed.
  @Output() removeItem = new EventEmitter<number>();

  /**
   * Handles quantity updates.
   * Only emits if the new quantity is positive.
   * @param quantity The updated quantity.
   */
  onQuantityChange(quantity: number): void {
    if (quantity > 0) {
      this.quantityChange.emit({ productId: this.cartItem.product.id, quantity });
    }
  }

  /**
   * Triggers the removal of the current item.
   */
  onRemove(): void {
    this.removeItem.emit(this.cartItem.product.id);
  }

  /**
   * Calculates the total price for this individual cart item.
   * @returns The item's total price.
   */
  getItemTotal(): number {
    return this.cartItem.product.price * this.cartItem.quantity;
  }
}
