import {Component, OnInit} from '@angular/core';
import {ProductService} from '../service/ProductService';
import {Cart} from '../model/Cart';
import {Product} from '../model/Product';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {render} from 'creditcardpayments/creditCardPayments';
import {CartService} from '../service/CartService';
import {ToastrService} from 'ngx-toastr';
import {Customer} from '../model/Customer';
import {CustomerService} from '../service/CustomerService';
import {CookieService} from '../login/service/cookie.service';
import {CommonService} from '../login/service/common.service';

declare var $: any;

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent implements OnInit {
  productInCartList: Cart[] = [];
  totalPayment: number;
  totalProduct: number;
  ship: number = 35000;
  product: Product;
  carts = [];
  quantity: Cart[];
  id: number;
  nameProduct: string;
  moneyDola: number;
  customer: Customer;
  role: string = '';
  username: string = '';
  token: string = '';
  codeSale: number;
  public inforStatus: boolean = false;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private tile: Title,
              private cartService: CartService,
              private toast: ToastrService,
              private router: Router,
              private customerService: CustomerService,
              private cookieService: CookieService,
              private commonService: CommonService) {
    this.tile.setTitle('Giỏ hàng');
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');

  }

  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  ngOnInit(): void {
    this.getCustomerByUserName(this.username);
    // this.paypal();
  }

  delete(productCart: Cart) {
    this.productService.deleteProductInCard(productCart).subscribe((d: Cart[]) => {
      this.productInCartList = d;
      console.log(d);
      this.calculation(d);
      this.toast.success('Đã xóa ' + productCart.product.name, 'Thành công');
      $('#deleteMinusModal' + productCart.product.id).modal('hide');
      $('#deleteModal' + productCart.product.id).modal('hide');
    }, error => {
    }, () => {
      this.productInCartList = [];
    });
  }


  getCustomerByUserName(username: string) {
    this.customerService.getCustomerByUserName(username).subscribe(d => {
      this.customer = d;
      if (d == null) {
        this.inforStatus = true;
      } else {
        this.inforStatus = d.appUser.isDeleted;
        this.getProductInCart(d);
      }
    });
  }

  getProductInCart(c: Customer) {
    this.cartService.getProductInCart(c).subscribe((d: Cart[]) => {
      if (c != null) {
        this.productInCartList = d;
        console.log(d);
        this.calculation(d);
      } else {
        this.productInCartList = [];
      }

    });
  }

  calculation(productCart: Cart[]) {
    this.totalProduct = 0;
    for (let i = 0; i < productCart.length; i++) {
      this.totalProduct += (productCart[i].quantity * productCart[i].product.priceSale);
      this.totalPayment = this.ship + this.totalProduct;
    }
    this.totalPayment = (this.ship + this.totalProduct);
    this.moneyDola = this.totalPayment / 23000;
    this.paypal();

    // render({
    //         id: '#payments',
    //         currency: 'VND',
    //         value: String((this.moneyDola).toFixed(2)),
    //         onApprove: (details) => {
    //           if (details.status == 'COMPLETED') {
    //             this.payment();
    //           }
    //         }
    //       }
    // );

  }

  paypal() {
    if (this.totalPayment > 0) {
      const target = $('#paymentsbt');
      target.remove('#payments');
      target.html('<div id="payments"></div>');
      render(
        {
          id: '#payments',
          currency: 'VND',
          value: String((this.moneyDola).toFixed(2)),
          onApprove: (details) => {
            if (details.status == 'COMPLETED') {
              this.payment();
            }
          }
        }
      );
    } else {
      this.toast.warning('Giỏ hàng đang trống');
    }
  }

  payment() {
    this.cartService.goPayment(this.customer).subscribe(d => {
      setTimeout(() => {
        this.router.navigateByUrl('/cart').then(() => {});
      }, 500);
      this.toast.success('Thanh toán thành công!');
    }, error => {
    }, () => {
      this.getProductInCart(this.customer);
    });
  }

  sendMessage(): void {
    this.commonService.sendUpdate('Success!');
  }

  minusQuantity(productOrder: Cart) {
    this.cartService.minusQuantity(productOrder).subscribe(value => {
      this.productInCartList = value;
      // this.quantity = value;
      this.calculation(value);
      this.sendMessage();
    });
  }

  plusQuantity(productOrder: Cart) {
    this.cartService.plusQuantity(productOrder).subscribe(value => {
      this.productInCartList = value;
      this.calculation(value);
      this.sendMessage();
    }, error => {
      if (error.error.message == 'maximum') {
        this.toast.warning('Số lượng sản phẩm đã tối đa.');
      }
    }, () => {
    });
  }
}
