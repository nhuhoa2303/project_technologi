import {Component, OnInit} from '@angular/core';
import {Customer} from '../model/Customer';
import {ProductService} from '../service/ProductService';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {CartService} from '../service/CartService';
import {ToastrService} from 'ngx-toastr';
import {CustomerService} from '../service/CustomerService';
import {CookieService} from '../login/service/cookie.service';
import {BillService} from '../service/BillService';
import {Bill} from '../model/Bill';
import {Cart} from '../model/Cart';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  customer: Customer;
  role: string = '';
  username: string = '';
  token: string = '';
  codeSale: number;
  public inforStatus: boolean = false;
  listHistoryBill: Cart[] = [];
  numberPage: number;
  page: number = 0;
  totalPage: number;
  countTotalPage: number[];
  size: number;

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private tile: Title,
              private cartService: CartService,
              private toast: ToastrService,
              private router: Router,
              private customerService: CustomerService,
              private cookieService: CookieService, private bill: BillService) {
    this.tile.setTitle('Lịch sử giao dịch');
    this.role = this.readCookieService('role');
    this.username = this.readCookieService('username');
    this.token = this.readCookieService('jwToken');

  }

  readCookieService(key: string): string {
    return this.cookieService.getCookie(key);
  }

  ngOnInit(): void {
    this.getCustomerByUserName(this.username);
  }

  getCustomerByUserName(username: string) {
    this.customerService.getCustomerByUserName(username).subscribe(d => {
      this.customer = d;
      if (d == null) {
        this.inforStatus = true;
      } else {
        this.inforStatus = d.appUser.isDeleted;
        this.displayHistoryBill(0, d);
      }
    });
  }

  displayHistoryBill(page: number, customer: Customer) {
    this.bill.displayListBill(page, customer).subscribe((d: Cart[]) => {
      // @ts-ignore
      this.listHistoryBill = d.content;
      // @ts-ignore
      this.totalPage = d.totalPages;
      // @ts-ignore
      this.countTotalPage = new Array(d.totalPages);
      // @ts-ignore
      this.numberPage = d.number;
      // @ts-ignore
      this.size = d.size;
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
      this.displayHistoryBill(number, this.customer);
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
      this.displayHistoryBill(number, this.customer);

    }

  }

  goItem(page: number) {
    this.numberPage = page;
    this.displayHistoryBill(this.page, this.customer);
  }

}
