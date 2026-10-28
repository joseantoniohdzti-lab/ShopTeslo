import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layouts/store-front-layou/store-front-layou';
import { HomePageComponent } from './pages/Home-Page/Home-Page';
import { GenderPageComponent } from './pages/gender-page/gender-page';
import { ProductPageComponent } from './pages/product-page/product-page';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page';

export const storeFrontRoutes: Routes = [
  {
    path :"",
    component : StoreFrontLayoutComponent,
    children  :[
      {path:"",component : HomePageComponent },
      {path:"gender/:gender",component : GenderPageComponent },
      {path:"product/:idSlug",component : ProductPageComponent },
      {path:"**",component : NotFoundPageComponent }
    ],
  },
  {
    path :"**",
    redirectTo :"",
  }

]


export default storeFrontRoutes;
