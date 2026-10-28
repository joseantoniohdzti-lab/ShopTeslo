import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Gender, Product, ProductResponse } from '@products/interfaces/product-interfaces';
import { count, EMPTY, empty, forkJoin, map, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { productCache } from '@products/interfaces/product-cache.interfaces';
import { User } from '@auth/interfaces/user-interfaces';
import { UrlSegment } from '@angular/router';

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({ providedIn: 'root' })
export class ProductsServices {
  private http = inject(HttpClient);
  private urlBase = environment.urlApiBaseTeleshop;
  private productCache = new Map<string, ProductResponse>();
  private oneProductCache = new Map<string, Product>();

  getProduct(opt: Options): Observable<ProductResponse> {
    const { limit = 10, offset = 0, gender = '' } = opt;
    const key = `${limit}-${offset}-${gender}`;

    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }

    return this.http
      .get<ProductResponse>(`${this.urlBase}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((resp) => {
          this.productCache.set(key, resp);
        }),
      );
  }

  getRutaImagenProduct(imagen: string): string {
    return `${this.urlBase}/files/product/${imagen}`;
  }

  getProductoByIdSlug(idSlug: string | null | undefined): Observable<Product> {
    if (idSlug === null) return EMPTY;
    if (!idSlug) return EMPTY;
    if (idSlug === undefined) return EMPTY;

    if (idSlug === 'new') return of(emptyProduct);

    if (this.oneProductCache.has(idSlug)) {
      return of(this.oneProductCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${this.urlBase}/products/${idSlug}`).pipe(
      tap((producto) => console.log(producto)),
      tap((response) => {
        this.oneProductCache.set(idSlug, response);
      }),
    );
  }

  updateProduct(
    id: string,
    product: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<ProductResponse> {
    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...product,
        images: [...(product.images ?? []), imageNames],
      })),
      switchMap((updateProduct) =>
        this.http.patch<ProductResponse>(`${this.urlBase}/products/${id}`, updateProduct),
      ),
      tap((response) => this.updateProductCache(response.products[0])),
    );
  }

  updateProductCache(product: Product) {
    const idProduct = product.id;

    this.oneProductCache.set(idProduct, product);

    this.productCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) =>
        currentProduct.id === idProduct ? product : currentProduct,
      );
    });
  }

  crearNewProduct(
    product: Partial<Product>,
    imageFileList?: FileList,
  ): Observable<ProductResponse> {
    return this.uploadImages(imageFileList).pipe(
      map((imagenesNames) => ({
        ...product,
        images: imagenesNames,
      })),
      switchMap((newProduct) =>
        this.http.post<ProductResponse>(`${this.urlBase}/products`, newProduct),
      ),
      tap((response) => this.updateProductCache(response.products[0])),
    );
  }

  uploadImages(imagenes?: FileList): Observable<string[]> {
    if (!imagenes) return of([]);

    const uploadObservables = Array.from(imagenes).map((imageFile) => this.uploadImage(imageFile));

    return forkJoin(uploadObservables).pipe(tap((imageNames) => console.log({ imageNames })));
  }

  uploadImage(imagenFile: File): Observable<string> {
    const formData = new FormData();

    formData.append('file', imagenFile);

    return this.http
      .post<{ fileName: string }>(`${this.urlBase}/file/product`, formData)
      .pipe(map((file) => file.fileName));
  }
}
