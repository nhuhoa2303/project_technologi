import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from '../login/service/cookie.service';
import {Observable} from 'rxjs';
import {StaticalProductMost} from '../model/StaticalProductMost';
import {StaticalCustomerMost} from '../model/StaticalCustomerMost';

const API_URL = `${environment.apiUrl}`;


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class StaticalMostService {
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');

  private PRODUCT_ORDER_BY_WEEK = API_URL + 'list-product-order-by-week';
  private PRODUCT_ORDER_BY_MONTH = API_URL + 'list-product-order-by-month';
  private PRODUCT_ORDER_BY_YEAR = API_URL + 'list-product-order-by-year';
  private SEARCH_PRODUCT_BY_DATE = API_URL + 'search-product-by-date';
  private CUSTOMER_ORDER_BY_WEEK = API_URL + 'list-customer-order-by-week';
  private CUSTOMER_ORDER_BY_MONTH = API_URL + 'list-customer-order-by-month';
  private CUSTOMER_ORDER_BY_YEAR = API_URL + 'list-customer-order-by-year';


  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  getProductOrderByWeek(): Observable<StaticalProductMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.PRODUCT_ORDER_BY_WEEK);
  }

  getProductOrderByMonth(): Observable<StaticalProductMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.PRODUCT_ORDER_BY_MONTH);
  }

  getProductOrderByYear(): Observable<StaticalProductMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.PRODUCT_ORDER_BY_YEAR);
  }

  getProductOrderBySearch(start: string, end: string): Observable<StaticalProductMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.SEARCH_PRODUCT_BY_DATE + '/' + start + '/' + end);
  }

  getCustomerOrderByWeek(): Observable<StaticalCustomerMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.CUSTOMER_ORDER_BY_WEEK);
  }

  getCustomerOrderByMonth(): Observable<StaticalCustomerMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.CUSTOMER_ORDER_BY_MONTH);
  }

  getCustomerOrderByYear(): Observable<StaticalCustomerMost[]> {
    return this.httpClient.get<StaticalProductMost[]>(this.CUSTOMER_ORDER_BY_YEAR);
  }
}
