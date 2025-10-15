import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { Product } from '../../models/product-model';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductListComponent implements OnInit {
  private cartService = inject(CartService);
  readonly products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      description: 'High-performance laptop for professionals',
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 699.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      description: 'Latest smartphone with advanced features',
    },
    {
      id: 3,
      name: 'Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      description: 'Wireless noise-cancelling headphones',
    },
    {
      id: 4,
      name: 'Tablet',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
      description: 'Lightweight tablet for productivity',
    },
    {
      id: 5,
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      description: 'Advanced fitness and health tracking',
    },
    {
      id: 6,
      name: 'Camera',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
      description: 'Professional DSLR camera',
    },
  ];
  ngOnInit(): void {}
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
