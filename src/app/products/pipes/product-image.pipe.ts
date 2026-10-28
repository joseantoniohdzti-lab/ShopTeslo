import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProductsServices } from '@products/services/product.service';

@Pipe({
  name: 'imageProductPipe'
})
export class ProductImagenPipe implements PipeTransform {
  private tesloShopServices = inject(ProductsServices);

  transform(value: null | undefined | string | string[]): string {
    const defaultImage = '/static/imagen/no-image.jpg';

    if (value === null || value === undefined) {
      return defaultImage;
    }

    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.length > 0
        ? this.tesloShopServices.getRutaImagenProduct(value[0])
        : defaultImage;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return this.tesloShopServices.getRutaImagenProduct(value);
    }

    return defaultImage;
  }
}
