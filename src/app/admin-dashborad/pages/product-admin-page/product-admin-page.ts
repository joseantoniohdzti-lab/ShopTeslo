import { ChangeDetectionStrategy, Component, effect, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@products/interfaces/product-interfaces';
import { ProductsServices } from '@products/services/product.service';
import { firstValueFrom, map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductAdminPage {

  private activeRoute = inject(ActivatedRoute);
  private productServices = inject(ProductsServices);
  private route = inject(Router);

  private idProduct = toSignal(this.activeRoute.params.pipe(map((params)=> params['id'])));
  // public idProduct =  this.activeRoute.snapshot.queryParamMap.get("id");




  public productResource = resource({
    params: ()=> ({id : this.idProduct()}) ,
    loader: async  ({params}) : Promise<Product> => {
      return await firstValueFrom( this.productServices.getProductoByIdSlug(params.id));
    }
  });


  redirectEffect =  effect(()=>{

    if(this.productResource.error()){
      this.route.navigateByUrl("admin/products");
    }

  });


}
