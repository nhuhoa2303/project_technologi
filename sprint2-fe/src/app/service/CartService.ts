import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from '../login/service/cookie.service';
import {Observable} from 'rxjs';
import {Customer} from '../model/Customer';
import {Cart} from '../model/Cart';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');
  private PAYMENT = API_URL + 'cart/payment';
  private ADD_CART = API_URL + 'add/cart';
  private CART = API_URL + 'cart';
  private TOTAL_PAYMENT = API_URL + 'cart/total';
  private QUANTITY = API_URL + 'quantity';
  private MINUS_QUANTITY = API_URL + 'minus/quantity';
  private PLUS_QUANTITY = API_URL + 'plus/quantity';
  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  displayQuantityProductInCart(customer: Customer): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.QUANTITY, customer  ,{headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  getProductInCart(customer: Customer): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.CART,customer, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  addOrder(productOrder: Cart): Observable<Cart> {
    return this.httpClient.post(this.ADD_CART, productOrder, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  goPayment(customer: Customer): Observable<any> {
    return this.httpClient.post(this.PAYMENT, customer, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

  minusQuantity(productOrder: Cart): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.MINUS_QUANTITY, productOrder, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }
  plusQuantity(productOrder: Cart): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.PLUS_QUANTITY, productOrder, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

}
