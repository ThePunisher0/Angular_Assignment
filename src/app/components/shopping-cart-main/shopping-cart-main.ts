import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../product-list/product-list';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart';
@Component({
  selector: 'app-shopping-cart-main',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ShoppingCartComponent],
  templateUrl: './shopping-cart-main.html',
  styleUrls: ['./shopping-cart-main.scss'],
})
export class ShoppingCartMainComponent {
  constructor() {}
}
