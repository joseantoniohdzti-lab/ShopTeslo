import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {

  private route = inject(ActivatedRoute);

  public currentPage = toSignal(this.route.queryParams.pipe(
    map(({page})=> (page? +page! :1)),
    map((pages) =>(isNaN(pages)?1 :pages))
  ),{
    initialValue : 1
  });

}
