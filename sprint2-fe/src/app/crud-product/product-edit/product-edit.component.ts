import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ProductService} from '../../service/ProductService';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, ParamMap, Router, RouterModule} from '@angular/router';
import {Product} from '../../model/Product';
import {FormControl, FormGroup} from '@angular/forms';
import {Category} from '../../model/Category';
import {formatDate} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';

declare var $: any;

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productEdit: Product = {};
  formEditProduct: FormGroup;
  categoryList: Category[] = [];
  fileUploader: any;
  imgSrc: any;
  selectFileImg: any = null;
  img: any;

  constructor(private tile: Title,
              private productService: ProductService,
              private toas: ToastrService,
              private storage: AngularFireStorage,
              private router: Router,
              private activate: ActivatedRoute) {
    this.tile.setTitle('Sửa sản phẩm');


  }

  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    this.activate.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id');
      this.productService.getProductById(parseInt(id)).subscribe(d => {
        this.productEdit = d;
        this.getAllCategory();
        this.formEdit();
      });
    });
  }

  formEdit() {
    this.imgSrc = this.productEdit.image;
    console.log(this.imgSrc);
    this.productEdit.createDate = this.productEdit.createDate.slice(0, 10);
    this.formEditProduct = new FormGroup({
      id: new FormControl(this.productEdit.id),
      name: new FormControl(this.productEdit.name),
      image: new FormControl(this.productEdit.image),
      createDate: new FormControl(this.productEdit.createDate),
      price: new FormControl(this.productEdit.price),
      quantity: new FormControl(this.productEdit.quantity),
      priceSale: new FormControl(this.productEdit.priceSale),
      madeIn: new FormControl(this.productEdit.madeIn),
      detail: new FormControl(this.productEdit.detail),
      specifications: new FormControl(this.productEdit.specifications),
      category: new FormControl(this.productEdit.category),
      isDelete: new FormControl(this.productEdit.isDelete)
    });
  }

  getAllCategory() {
    this.productService.getAllCategory().subscribe(d => {
      this.categoryList = d;
    });
  }

  displayValueDefault(c1: Category, c2: Category) {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getCurrentDateTime(): string {
    return formatDate(new Date(), 'dd-MM-yyyy-hh:mm:ssa', 'en-US');
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (image: any) => this.imgSrc = image.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectFileImg = event.target.files[0];
      console.log(this.imgSrc);
      // console.log(this.selectFileImg);
      document.getElementById('img').style.display = 'block';
    } else {
      this.imgSrc = '';
      this.selectFileImg = null;
    }
  }

  update() {
    this.productService.update(this.formEditProduct.value).subscribe(d => {
      this.toas.success('Sửa được rồi đó!!!');
    }, error => {
    }, () => {
      this.router.navigateByUrl('/')
    });
  }


}
