import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-interfaces';
import { ProductImagenPipe } from '@products/pipes/product-image.pipe';
import { ProductsServices } from '@products/services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink,SlicePipe, ProductImagenPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  products = input.required<Product>();
}
