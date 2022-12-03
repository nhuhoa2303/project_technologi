import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../service/CustomerService';
import {ProductService} from '../service/ProductService';
import {Title} from '@angular/platform-browser';
import {CookieService} from '../login/service/cookie.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {CommonService} from '../login/service/common.service';
import {CartService} from '../service/CartService';
import {Customer} from '../model/Customer';

@Component({
    selector: 'app-infor-customer',
    templateUrl: './infor-customer.component.html',
    styleUrls: ['./infor-customer.component.css']
})
export class InforCustomerComponent implements OnInit {
    role: string = '';
    username: string = '';
    token: string = '';
    customer: Customer;
    public inforStatus: boolean = false;
    infoCustomerList: Customer[];

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

    ngOnInit(): void {
        this.getCustomerByUserName(this.username);

    }

    getCustomerByUserName(username: string) {
        this.customerService.getCustomerByUserName(username).subscribe(d => {
            this.customer = d;
            console.log(d);
            if (d == null) {
                this.inforStatus = true;
            } else {
                this.inforStatus = d.appUser.isDeleted;
            }
        });
    }

    nameReadonly() {
        document.getElementById('name').removeAttribute('readonly');
    }
    usernameReadonly() {
        document.getElementById('username').removeAttribute('readonly');
    }
    birthdayReadonly() {
        document.getElementById('birthday').removeAttribute('readonly');
    }
    genderReadonly() {
        document.getElementById('gender').removeAttribute('readonly');
    }
    phoneReadonly() {
        document.getElementById('phone').removeAttribute('readonly');
    }
    addressReadonly() {
        document.getElementById('address').removeAttribute('readonly');
    }

    getReadonly() {

    }


}
