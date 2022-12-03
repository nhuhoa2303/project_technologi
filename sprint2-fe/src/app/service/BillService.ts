import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from '../login/service/cookie.service';
import {Customer} from '../model/Customer';
import {Observable} from 'rxjs';
import {Bill} from '../model/Bill';
import {Cart} from '../model/Cart';

const API_URL = `${environment.apiUrl}`;


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class BillService {

  private LIST_BILL = API_URL + 'list-bill';
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }

  displayListBill(page: number, customer: Customer): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.LIST_BILL + '?page=' + page, customer, {headers: new HttpHeaders({'authorization': this.header})}).pipe();
  }

}
