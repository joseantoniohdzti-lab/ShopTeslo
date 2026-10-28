import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsServices } from '@products/services/product.service';
import {toSignal} from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { Product } from '@products/interfaces/product-interfaces';
import { ProductCarusel } from '@products/components/product-carusel/product-carusel';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarusel],
  templateUrl: './product-page.html',
})
export class ProductPageComponent {
  private tesloShopServices = inject(ProductsServices);
  private activeRouters = inject(ActivatedRoute);

  private idSlug = toSignal( this.activeRouters.paramMap.pipe(map((params) => params.get('idSlug'))));
  // private idSlug = signal<string>(this.activeRouters.snapshot.queryParamMap.get("id"));

  productResource = resource({
    params : ()=> ({idSlung : this.idSlug()}),
    loader : async({params}) :Promise<Product> => {
       const response  = this.tesloShopServices.getProductoByIdSlug(params?.idSlung);
       return await firstValueFrom(response);
    }
  });



}
