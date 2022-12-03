import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CookieService} from '../login/service/cookie.service';
import {LogoutService} from '../login/service/logout.service';
import {CommonService} from '../login/service/common.service';
import {ProductService} from '../service/ProductService';
import {FormControl, FormGroup} from '@angular/forms';
import {CartService} from '../service/CartService';
import {Cart} from '../model/Cart';
import {CustomerService} from '../service/CustomerService';
import {Customer} from '../model/Customer';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role: string = '';
  username: string = '';
  token: string = '';
  messageReceived: any;
  private subscriptionName: Subscription;
  formSearch: FormGroup;
  nameSearch: string = '';
  quantityProductInCart: Cart[] = [];
  customer: Customer;
  inforStatus: boolean = false;
  user: string;
  quantity: number;


  constructor(private cookieService: CookieService,
              private toasService: ToastrService,
              private logoutService: LogoutService,
              private router: Router,
              private commonService: CommonService,
              private productService: ProductService,
              private activate: ActivatedRoute,
              private cartService: CartService, private customerService: CustomerService) {
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');
    // subscribe to sender component messages
    this.subscriptionName = this.commonService.getUpdate().subscribe(message => {
      this.messageReceived = message;
      this.role = this.readCookieService('role');
      this.username = this.readCookieService('username');
      this.user = this.username;
      this.token = this.readCookieService('jwToken');
      this.getCustomerByUserName(this.username);

    });
  }

  ngOnInit(): void {
    this.searchForm();
    this.getCustomerByUserName(this.username);
    this.displayQuantityProductInCart(this.customer);
  }


  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }


  onLogout() {
    setTimeout(() => {
      if (this.cookieService.getCookie('jwToken') != null) {
        this.logoutService.onLogout(this.cookieService.getCookie('jwToken')).subscribe(() => {
          this.cookieService.deleteAllCookies();
          this.cookieService.removeAllCookies();
        }, error => {
          switch (error.error) {
            case 'isLogout':
              this.toasService.warning('Bạn chưa đăng nhập!');
              break;
            case 'LoginExpired':
              this.cookieService.deleteAllCookies();
              this.router.navigateByUrl('/login').then(() => {
                this.toasService.warning('Hết phiên đăng nhập vui lòng đăng nhập lại!');
                this.sendMessage();
              });
              break;
            default:
              this.cookieService.deleteAllCookies();
              this.cookieService.removeAllCookies();
              this.router.navigateByUrl('/login').then(() => {
                this.toasService.warning('Hết phiên đăng nhập vui lòng đăng nhập lại!');
                this.sendMessage();
              });
              break;
          }
        }, () => {
          this.router.navigateByUrl('/login').then(() => {
            this.toasService.success('Đăng xuất thành công!');
            this.sendMessage();
          });
        });
      } else {
        this.toasService.warning('Bạn chưa đăng nhập!');
      }
    }, 1000);
    this.router.navigateByUrl('/loading').then(() => {
    });
  }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.commonService.sendUpdate('Đăng Xuất thành công!');
  }


  searchForm() {
    this.formSearch = new FormGroup({
      nameSearch: new FormControl('')
    });
  }

  searchNameProduct() {
    this.nameSearch = this.formSearch.value.nameSearch.trim();
  }

  getCustomerByUserName(username: string) {
    this.customerService.getCustomerByUserName(username).subscribe(d => {
      this.customer = d;
      if (d == null) {
        this.inforStatus = true;
      } else {
        this.displayQuantityProductInCart(d);
        this.inforStatus = d.appUser.isDeleted;
      }
    });
  }

  displayQuantityProductInCart(customer: Customer) {
    this.quantity = 0;
    this.cartService.displayQuantityProductInCart(customer).subscribe(d => {
      if (d != null) {
        this.quantityProductInCart = d;
        for (let i = 0; i < d.length; i++) {
          this.quantity += d[i].quantity;
        }
        console.log(this.quantity);
      } else {
        this.quantityProductInCart = [];
      }
    }, error => {
    }, () => {
    });
  }


  notification() {
    if (this.token == ''){
      this.toasService.warning("Bạn cần phải đăng nhập mới vào được")
    }
  }
}
