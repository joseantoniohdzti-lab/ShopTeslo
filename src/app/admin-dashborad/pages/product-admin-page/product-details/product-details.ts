import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '@products/interfaces/product-interfaces';
import { ProductCarusel } from '@products/components/product-carusel/product-carusel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductsServices } from '@products/services/product.service';
import { v4 as UuidV4 } from 'uuid';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductImagenPipe } from '../../../../products/pipes/product-image.pipe';

const productFb = {
  title: ['', [Validators.minLength(10)]],
  slug: ['', [Validators.required, Validators.minLength(10)]],
  description: ['', [Validators.required, Validators.minLength(10)]],
  price: ['', [Validators.required]],
  stock: ['', [Validators.required]],
  tags: ['', [Validators.required]],
  gender: ['', [Validators.required]],
  sizes: [['']],
  images: [[]],
};

@Component({
  selector: 'app-product-details',
  imports: [ProductCarusel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProductDetails implements OnInit {
  private route = inject(Router);
  private fb = inject(FormBuilder);
  private productServices = inject(ProductsServices);
  product = input.required<Product>();

  wasSaved = signal<boolean>(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  imagenesCarusel = computed(() => {
    const currentProdutImagen = [...(this.product()?.images ?? []), ...this.tempImages()];
    return currentProdutImagen ?? [];
  });

  productFrom = this.fb.group(productFb);

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLink: Partial<Product>) {
    this.productFrom.patchValue(formLink as any);
    this.productFrom.patchValue({ tags: formLink.tags?.join(',') });
  }

  sizeClick(size: string) {
    const currentSizes = this.productFrom.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productFrom.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productFrom.valid;
    this.productFrom.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productFrom.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      // const productLikeNew: Partial<Product> = {
      //   ...productLike,
      //   id: UuidV4(),
      // };

      const product = await firstValueFrom(
        this.productServices.crearNewProduct(productLike, this.imageFileList),
      );

      this.route.navigate(['/admin/product/', product.products[0].id]);
    } else {
      const product = await firstValueFrom(
        this.productServices.updateProduct(this.product().id, productLike, this.imageFileList),
      );
      this.route.navigate(['/admin/product/', product.products[0].id]);
    }

    this.wasSaved.set(true);

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 2000);
  }

  //imagenes

  onFilesChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.tempImages.set([]);
      this.imageFileList = undefined;
      return;
    }

    this.imageFileList = files;
    const fileArray = Array.from(files);
    const readPromises = fileArray.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readPromises).then((imagesBase64) => {
      this.tempImages.set(imagesBase64);
    });
  }
}
