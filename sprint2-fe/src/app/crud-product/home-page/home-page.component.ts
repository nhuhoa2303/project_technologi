import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/ProductService';
import {Product} from '../../model/Product';
import {Title} from '@angular/platform-browser';
import {CookieService} from '../../login/service/cookie.service';
import {Category} from '../../model/Category';
import {Cart} from '../../model/Cart';
import {Customer} from '../../model/Customer';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../service/CartService';
import {CustomerService} from '../../service/CustomerService';
import {CommonService} from '../../login/service/common.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  productList: Product[] = [];
  productNearDayList: Product[] = [];
  role: string = '';
  username: string = '';
  token: string = '';
  page: number;
  totalPage: number;
  countTotalPage: number[];
  numberPage: number = 0;

  categoryList: Category [] = [];
  customer: Customer;
  public inforStatus: boolean = false;

  constructor(private productService: ProductService,
              private customerService: CustomerService,
              private cartService: CartService,
              private tile: Title,
              private cookieService: CookieService,
              private toas: ToastrService,
              private commonService: CommonService) {
    this.tile.setTitle('Trang chủ');

    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');
    this.getCustomerByUserName(this.username);
  }

  ngOnInit(): void {
    this.getAll(this.numberPage);
    this.getAllCategory();
    this.getProductNearDay();
  }

  sendMessage(): void {
    this.commonService.sendUpdate('Success!');
  }

  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  private getAll(numberPage: number) {
    this.productService.getAll(numberPage).subscribe(d => {
      // @ts-ignore
      this.productList = d.content;
      // @ts-ignore
      this.totalPage = d.totalPages;
      // @ts-ignore
      this.countTotalPage = new Array(d.totalPages);
      // @ts-ignore
      this.numberPage = d.number;
    });
  }

  previousPage(event) {
    window.scroll({
      top: 1300,
      left: 0,
      behavior: 'smooth'
    });
    let number: number = this.numberPage;
    if (number > 0) {
      number--;
      this.getAll(number);
    }
  }

  nextPage(event) {
    window.scroll({
      top: 1300,
      left: 0,
      behavior: 'smooth'
    });
    let number: number = this.numberPage;
    if (number < this.totalPage) {
      number++;
      this.getAll(number);
    }
  }

  goItem(page: number) {
    this.numberPage = page;
    this.getAll(page);
  }


  private getProductNearDay() {
    this.productService.getProductNearDay().subscribe(d => {
      this.productNearDayList = d;
    });
  }


  private getAllCategory() {
    this.productService.getAllCategory().subscribe(data => {
      this.categoryList = data;

    });
  }

  //
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

  addToCart(product: Product) {
    let carts: Cart = {
      customer: this.customer,
      product: product,
      quantity: 1
    };
    this.cartService.addOrder(carts).subscribe((ca: Cart) => {
      this.toas.success('Đã thêm sản phẩm ' + ca.product.name, 'Thành công');
      this.sendMessage();
    }, error => {
      if (error.error.message == 'quantity') {
        this.toas.warning('Bạn đã thêm vượt quá số lượng sản phẩm!');
      }
    });
  }

}
