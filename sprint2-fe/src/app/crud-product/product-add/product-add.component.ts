import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/ProductService';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {Category} from '../../model/Category';
import {formatDate} from '@angular/common';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  formAddProduct: FormGroup;
  categoryList: Category[] = [];
  selectFileImg: any = null;
  imgSrc: any;
  fileUploader: any;

  constructor(private productService: ProductService,
              private toast: ToastrService,
              private title: Title,
              private storage: AngularFireStorage,
              private router: Router) {
    this.title.setTitle('Thêm mới');
  }

  ngOnInit(): void {
    this.formAdd();
    this.getAllCategory();

  }

  formAdd() {

    this.formAddProduct = new FormGroup({
      name: new FormControl(''),
      image: new FormControl(),
      createDate: new FormControl(''),
      price: new FormControl(''),
      quantity: new FormControl(''),
      priceSale: new FormControl(''),
      madeIn: new FormControl(''),
      detail: new FormControl(''),
      specifications: new FormControl(''),
      category: new FormControl(''),
      isDelete: new FormControl(0),
    });
  }

  getAllCategory() {
    this.productService.getAllCategory().subscribe(d => {
      this.categoryList = d;
      this.formAdd();
    });
  }

  save() {
    const nameImg = this.getCurrentDateTime() + this.selectFileImg.name;
    const fileRel = this.storage.ref(nameImg);
    this.storage.upload(nameImg, this.selectFileImg).snapshotChanges().pipe(finalize(() => {
      fileRel.getDownloadURL().subscribe((url) => {
        this.formAddProduct.patchValue({image: url});
        this.productService.add(this.formAddProduct.value).subscribe(d => {
          console.log(d);
          this.toast.success('Thêm mới rồi đó!!!');
          this.router.navigateByUrl('/')
        });
      });
    })).subscribe();
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
      document.getElementById('img').style.display = 'block';
    } else {
      this.imgSrc = '';
      this.selectFileImg = null;
    }
  }

}
