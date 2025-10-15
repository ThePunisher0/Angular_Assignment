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
  private cartService = inject(CartService);
  readonly cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;
  readonly totalPrice$: Observable<number> = this.cartService.getTotalPrice();
  readonly itemCount$: Observable<number> = this.cartService.getItemCount();
  ngOnInit(): void {}

  trackByProductId(index: number, item: CartItem): number {
    return item?.product?.id ?? index;
  }
  onQuantityChange(event: { productId: number; quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }
  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
  onClearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }
}
