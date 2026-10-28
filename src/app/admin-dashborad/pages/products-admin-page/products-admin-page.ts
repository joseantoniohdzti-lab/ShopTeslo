import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductResponse } from '@products/interfaces/product-interfaces';
import { ProductsServices } from '@products/services/product.service';
import { PaginationService } from '@shared/components/pagination/paginatio.service';
import { reduce, firstValueFrom } from 'rxjs';
import { PaginationComponent } from '@shared/components/pagination/pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductsAdminPage {

  private productServices = inject(ProductsServices);
   public paginationServices = inject(PaginationService);

   limit = signal<number>(10);


  productAdminResouces = resource ({
    params : ()=>({page :this.paginationServices.currentPage()-1,limit : this.limit()}),
    loader : async  ({params}):Promise<ProductResponse> => {
      return  await firstValueFrom(this.productServices.getProduct({offset :params.page * 9,limit : params.limit}));
    }
  });

  pages = computed(()=>{
    return this.productAdminResouces.value()?.pages ?? 0;
  });

}
