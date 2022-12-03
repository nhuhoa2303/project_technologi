import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/ProductService';
import {Product} from '../../model/Product';
import {Title} from '@angular/platform-browser';
import {CookieService} from '../../login/service/cookie.service';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Cart} from '../../model/Cart';
import {CommonService} from '../../login/service/common.service';
import {CustomerService} from '../../service/CustomerService';
import {Customer} from '../../model/Customer';
import {CartService} from '../../service/CartService';

declare var $: any;

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.css']
})
export class LaptopComponent implements OnInit {
  laptopList: Product[] = [];
  role: string = '';
  username: string = '';
  token: string = '';

  page: number = 0;
  totalPage: number;
  countTotalPage: number[];
  numberPage: number = 0;
  beforePrice: string = '0';
  afterPrice: string = '9999999999';
  sort: string = '';
  nameLaptop = '';
  formSearch: FormGroup;
  nameSearch: string = '';
  product: Product;
  cart = [];
  customer: Customer;
  public inforStatus: boolean = false;
  quantityProduct: number;
  idDelete: number;
  nameDelete: string;
  priceDelete: number;

  constructor(private productService: ProductService,
              private tile: Title,
              private cookieService: CookieService,
              private toas: ToastrService,
              private activatedRoute: ActivatedRoute,
              private commonService: CommonService,
              private customerService: CustomerService,
              private cartService: CartService) {
    this.tile.setTitle('Laptop');
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');
  }

  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  sendMessage(): void {
    this.commonService.sendUpdate('Success!');
  }

  ngOnInit(): void {
    this.getLaptopAll(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
    this.searchForm();
    this.getCustomerByUserName(this.username);
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
  if (this.username != ''){
    let carts: Cart = {
      customer: this.customer,
      product: laptop,
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
  }else {
    this.toas.warning("Đăng nhập đi rồi làm gì thì làm :||")
  }
  }


  getLaptopAll(numberPage: number, nameSearch: string, nameLaptop: string, beforePrice: string, afterPrice: string, sort: string) {
    this.productService.getLaptop(numberPage, nameSearch, nameLaptop, beforePrice, afterPrice, sort).subscribe(data => {
      // @ts-ignore
      this.laptopList = data.content;
      // @ts-ignore
      this.totalPage = data.totalPages;
      // @ts-ignore
      this.countTotalPage = new Array(data.totalPages);
      // @ts-ignore
      this.numberPage = data.number;
      // @ts-ignore
      this.size = data.size;
      // @ts-ignore
      this.quantityProduct = data.quantity;
    });
  }

  previousPage(event) {
    window.scroll({
      top: 100,
      left: 0,
      behavior: 'smooth'
    });
    let number: number = this.numberPage;
    if (number > 0) {
      number--;
      this.getLaptopAll(number, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
    }
  }

  nextPage(event) {
    window.scroll({
      top: 100,
      left: 0,
      behavior: 'smooth'
    });
    let number: number = this.numberPage;
    if (number < this.totalPage) {
      number++;
      this.getLaptopAll(number, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);

    }

  }

  goItem(page: number) {
    this.numberPage = page;
    this.getLaptopAll(0, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
  }

  searchPrice(before: string, after: string, event) {
    window.scroll({
      top: 100,
      left: 0,
      behavior: 'smooth'
    });
    this.beforePrice = before;
    this.afterPrice = after;
    this.getLaptopAll(0, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
  }

  searchName(name: string, event) {
    window.scroll({
      top: 100,
      left: 0,
      behavior: 'smooth'
    });
    this.nameLaptop = name;
    this.getLaptopAll(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
  }


  sortPriceDesc() {
    this.sort = 'price_sale,desc';
    this.getLaptopAll(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
  }

  sortPriceAsc() {
    this.sort = 'price_sale,asc';
    this.getLaptopAll(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
  }

  searchForm() {
    this.formSearch = new FormGroup({
      nameSearch: new FormControl('')
    });
  }

  searchNameProduct() {
    this.nameSearch = this.formSearch.value.nameSearch.trim();
    this.productService.getLaptop(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort).subscribe(d => {
        console.log(this.formSearch.value.nameSearch);
        // @ts-ignore
        this.laptopList = d.content;
        console.log(d);
      }
    );
  }


  showModalDelete(laptop: Product) {
    this.idDelete = laptop.id;
    this.nameDelete = laptop.name;
    this.priceDelete = laptop.priceSale;
  }

  deleteProduct(idDelete: number) {
    this.productService.deleteProductById(idDelete).subscribe(d => {
    }, error => {
    }, () => {
      this.toas.success('Đã xóa thành công', 'Chúc mừng');
      this.getLaptopAll(this.numberPage, this.nameSearch, this.nameLaptop, this.beforePrice, this.afterPrice, this.sort);
    });
  }
}
