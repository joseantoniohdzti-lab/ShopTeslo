import { JsonPipe } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductResponse } from '@products/interfaces/product-interfaces';
import { ProductsServices } from '@products/services/product.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { PaginationComponent } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/paginatio.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, PaginationComponent],
  templateUrl: './Home-Page.html',
})
export class HomePageComponent {
  private tesloShopServices = inject(ProductsServices);
  public paginationServices = inject(PaginationService);
  private authServices = inject(AuthService);


  productsResource = resource({
    params : ()=> ({page : this.paginationServices.currentPage()-1}),
    loader: async ({params}): Promise<ProductResponse> => {
      const result = await firstValueFrom(this.tesloShopServices.getProduct({offset : params.page * 9}));
      return result;
    },
  });

  pages = computed(()=>{
    return this.productsResource.value()?.pages ?? 0;
  });


}
