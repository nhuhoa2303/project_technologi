import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from '../login/service/cookie.service';
import {Customer} from '../model/Customer';
import {Observable} from 'rxjs';
import {Cart} from '../model/Cart';

const API_URL = `${environment.apiUrl}`
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private GET_CUSTOMER = API_URL + 'customer/'
  private header = 'Bearer ' + this.cookieService.getCookie('jwToken');

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
  }


  getCustomerByUserName(userName: string): Observable<Customer> {
    return this.httpClient.get(this.GET_CUSTOMER + userName)
  }


}
