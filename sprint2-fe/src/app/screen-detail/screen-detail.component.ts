import {Component, OnInit} from '@angular/core';
import {ProductService} from '../service/ProductService';
import {Product} from '../model/Product';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {CookieService} from '../login/service/cookie.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../login/service/common.service';
import {CustomerService} from '../service/CustomerService';
import {CartService} from '../service/CartService';
import {Customer} from '../model/Customer';
import {Cart} from '../model/Cart';

@Component({
  selector: 'app-screen-detail',
  templateUrl: './screen-detail.component.html',
  styleUrls: ['./screen-detail.component.css']
})
export class ScreenDetailComponent implements OnInit {
  product: Product = {};
  role: string = '';
  username: string = '';
  token: string = '';
  customer: Customer;
  public inforStatus: boolean = false;
  quantity: Cart[] ;

  constructor(private productService: ProductService,
              private tile: Title,
              private cookieService: CookieService,
              private toas: ToastrService,
              private commonService: CommonService,
              private customerService: CustomerService,
              private cartService: CartService,
              private activate: ActivatedRoute) {
    this.tile.setTitle('Chi tiết sản phẩm');
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');
    this.getCustomerByUserName(this.username);
  }

  ngOnInit(): void {
    this.getProductById();
  }

  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  private getProductById() {
    this.activate.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id');
      this.productService.getProductById(parseInt(id)).subscribe(d => {
        this.product = d;
        console.log(d);
      });
    });
  }

  getCustomerByUserName(username: string) {
    this.customerService.getCustomerByUserName(username).subscribe(d => {
      this.customer = d;
      if (d == null) {
        this.inforStatus = true;
      } else {
        this.inforStatus = d.appUser.isDeleted;

      }
    });
  }

  addToCart(laptop: Product) {
    let carts: Cart = {
      customer: this.customer,
      product: laptop,
      quantity: 1
    };
    this.cartService.addOrder(carts).subscribe((ca: Cart) => {
      this.toas.success('Đã thêm sản phẩm ' + ca.product.name, 'Thành công');
    }, error => {
      if (error.error.message == 'quantity') {
        this.toas.warning('Bạn đã thêm vượt quá số lượng sản phẩm!');
      }
    });
  }
  //
  // minusQuantity(productOrder: Cart) {
  //   this.cartService.minusQuantity(productOrder).subscribe(value => {
  //     this.product = value.content;
  //     this.quantity = value;
  //   });
  // }
  //
  // plusQuantity(productOrder: Cart) {
  //   this.cartService.plusQuantity(productOrder).subscribe(value => {
  //     this.productInCartList = value;
  //   }, error => {
  //     if (error.error.message == 'maximum') {
  //       this.toas.warning('Số lượng sản phẩm đã tối đa.');
  //     }
  //   });
  // }
}
