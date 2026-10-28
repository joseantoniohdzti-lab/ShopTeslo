import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagenPipe } from '../../pipes/product-image.pipe';

@Component({
  selector: 'app-product-carusel',
  imports: [ProductImagenPipe],
  templateUrl: './product-carusel.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }
  `,
})
export class ProductCarusel implements AfterViewInit, OnChanges {
  imagenes = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagenes']?.firstChange) {
      return;
    }

    if (!this.swiper) return;

    this.swiper.destroy(true, true);

    const paginationElement: HTMLDivElement | null =
      this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    if (paginationElement) {
      paginationElement.innerHTML = '';
    }

    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv()?.nativeElement;

    if (!element) return;

    const hasMultiple = (this.imagenes()?.length ?? 0) > 1;

    this.swiper = new Swiper(element, {
      direction: 'horizontal',
      loop: hasMultiple,

      modules: [Navigation, Pagination],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
