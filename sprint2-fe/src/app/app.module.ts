import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {ToastrModule} from 'ngx-toastr';
import {ShareModule} from './share/share.module';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {HomePageComponent} from './crud-product/home-page/home-page.component';
import {SmartPhoneComponent} from './crud-product/smart-phone/smart-phone.component';
import {LaptopComponent} from './crud-product/laptop/laptop.component';
import {ScreenDetailComponent} from './screen-detail/screen-detail.component';
import {CartProductComponent} from './cart-product/cart-product.component';
import {HomeLoginComponent} from './login/home-login/home-login.component';
import {ProductAddComponent} from './crud-product/product-add/product-add.component';
import {ReactiveFormsModule} from '@angular/forms';
import { HistoryListComponent } from './history-list/history-list.component';
import { InforCustomerComponent } from './infor-customer/infor-customer.component';
import { ProductEditComponent } from './crud-product/product-edit/product-edit.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';

import { StaticalCustomerComponent } from './statistic/statical-customer/statical-customer.component';
import { StaticalProductComponent } from './statistic/statical-product/statical-product.component';
import {StatisticalComponent} from './statistical/statistical.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
const googleLoginOptions = {
  scope: '1088860659865-49rmmm1dmfndjskl5oh485417cfhbi4t.apps.googleusercontent.com'
};

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    SmartPhoneComponent,
    LaptopComponent,
    ScreenDetailComponent,
    CartProductComponent,
    HomeLoginComponent,
    ProductAddComponent,
    HistoryListComponent,
    InforCustomerComponent,
    ProductEditComponent,
    StatisticalComponent,
    StaticalCustomerComponent,
    StaticalProductComponent

  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(
      {
        timeOut: 2000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-left',
        preventDuplicates: true,
      }
    ),
    ShareModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1088860659865-49rmmm1dmfndjskl5oh485417cfhbi4t.apps.googleusercontent.com', googleLoginOptions
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('863324377984890')
          }
        ]
      } as SocialAuthServiceConfig,
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
