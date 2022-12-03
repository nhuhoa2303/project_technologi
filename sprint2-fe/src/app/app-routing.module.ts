import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePageComponent} from './crud-product/home-page/home-page.component';
import {LaptopComponent} from './crud-product/laptop/laptop.component';
import {SmartPhoneComponent} from './crud-product/smart-phone/smart-phone.component';
import {ScreenDetailComponent} from './screen-detail/screen-detail.component';
import {CartProductComponent} from './cart-product/cart-product.component';
import {HomeLoginComponent} from './login/home-login/home-login.component';
import {AdminGuard} from './login/authguard/admin.guard';
import {ProductAddComponent} from './crud-product/product-add/product-add.component';
import {UserGuard} from './login/authguard/user.guard';
import {HistoryListComponent} from './history-list/history-list.component';
import {InforCustomerComponent} from './infor-customer/infor-customer.component';
import {ProductEditComponent} from './crud-product/product-edit/product-edit.component';
import {StatisticalComponent} from './statistical/statistical.component';
import {StaticalCustomerComponent} from './statistic/statical-customer/statical-customer.component';
import {StaticalProductComponent} from './statistic/statical-product/statical-product.component';

const routes: Routes = [

  {path: '', component: HomePageComponent,},
  {path: 'laptop', component: LaptopComponent},
  // {path: 'laptop/:name', component: LaptopComponent},
  {path: 'smartphone', component: SmartPhoneComponent},
  {path: 'detail/:id', component: ScreenDetailComponent},
  {path: 'login', component: HomeLoginComponent},
  {path: 'cart', component: CartProductComponent},
  {path: 'history-bill', component: HistoryListComponent},
  {path: 'info-customer', component: InforCustomerComponent},
  {path: 'product-add', component: ProductAddComponent, canActivate: [AdminGuard]},
  {path: 'product-edit/:id', component: ProductEditComponent, canActivate: [AdminGuard]},
  {path: 'thong-ke-san-pham', component: StaticalProductComponent, canActivate: [AdminGuard]},
  {path: 'thong-ke-khach-hang', component: StaticalCustomerComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule {
}
