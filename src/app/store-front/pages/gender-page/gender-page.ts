import { JsonPipe } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductResponse } from '@products/interfaces/product-interfaces';
import { ProductsServices } from '@products/services/product.service';
import { firstValueFrom, map } from 'rxjs';
import { ProductCard } from '@products/components/product-card/product-card';
import { PaginationService } from '@shared/components/pagination/paginatio.service';
import { PaginationComponent } from '@shared/components/pagination/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, PaginationComponent],
  templateUrl: './gender-page.html',
})
export class GenderPageComponent {
  private route = inject(ActivatedRoute);
  public gender = toSignal(this.route.params.pipe(map((gender) => gender['gender'])));
  private ProductServices = inject(ProductsServices);
  public paginationServices = inject(PaginationService);

  genderResource = resource({
    params: () => ({ gender: this.gender(), page: this.paginationServices.currentPage() - 1 }),
    loader: async ({ params }): Promise<ProductResponse> => {
      const response = await firstValueFrom(
        this.ProductServices.getProduct({ offset: params.page * 9, gender: params.gender }),
      );

      return response;
    },
  });

  pages = computed(() => {
    return this.genderResource.value()?.pages ?? 0;
  });
}
