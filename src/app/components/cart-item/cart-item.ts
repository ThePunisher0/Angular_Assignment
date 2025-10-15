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
  @Input({ required: true }) cartItem!: CartItem;
  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() removeItem = new EventEmitter<number>();
  onQuantityChange(quantity: number): void {
    if (quantity > 0) {
      this.quantityChange.emit({ productId: this.cartItem.product.id, quantity });
    }
  }
  onRemove(): void {
    this.removeItem.emit(this.cartItem.product.id);
  }
  getItemTotal(): number {
    return this.cartItem.product.price * this.cartItem.quantity;
  }
}
