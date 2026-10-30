
import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProductsServices } from '@products/services/product.service';

@Pipe({
  name: 'imageProductPipe',
  standalone: true,
})
export class ProductImagenPipe implements PipeTransform {
  private tesloShopServices = inject(ProductsServices);

  transform(value: null | undefined | string | string[]): string {
    const defaultImage = '/static/imagen/no-image.jpg';

    if (value === null || value === undefined) {
      return defaultImage;
    }

    if (Array.isArray(value)) {
      return value.length > 0
        ? this.transform(value[0])
        : defaultImage;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return defaultImage;
    }

    if (
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://')
    ) {
      return trimmed;
    }

    return this.tesloShopServices.getRutaImagenProduct(trimmed);
  }
}
