import {Component, OnInit} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {AuthService} from '../../../shared/services/auth.service';
import {ProductService} from '../../../shared/services/product.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList: Product[] = [];
  loading = false;

  brandsOne = [];
  brandsTwo = [];
  brandsThree = [];

  selectedBrand = [];
  page = 1;
  searchForm = new FormGroup({
    searchQ: new FormControl(''),
  });

  showGroups = false;
  showDiseases = false;
  showReset = false;

  private snapshot;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap => {
      const searchQ = paramMap.get('q');
      if (searchQ) {
        this.searchForm.controls.searchQ.setValue(searchQ);
      } else {
        this.getAllProducts('');
      }
    });

    // this.getAllCategories();

    this.searchForm.valueChanges.pipe(
      debounceTime(800),
    )
      .subscribe((value) => {
        if (value.searchQ && value.searchQ.trim() &&
          !(this.snapshot && this.snapshot.searchQ && value.searchQ.trim() === this.snapshot.searchQ.trim())) {
          this.getAllProducts(value.searchQ.trim());
          this.showReset = true;
        }
        this.selectedBrand = Object.entries(value).filter((item) => item[1] === true).map((item) => item[0]);
        if (value.searchQ && value.searchQ.trim() || this.selectedBrand.length) {
          this.showReset = true;
        }
        this.snapshot = value;
      });
  }

  getAllProducts(query) {
    // this.spinnerService.show();
    this.productList = [];
    this.loading = true;

    this.productService.getProducts(query).subscribe(
      products => {
        products.forEach(product => {
          this.productList.push(product);
        });
        this.loading = false;
      },
      (err) => {
        this.toastrService.error('Ошибка ', err);
      }
    );
  }

  getAllCategories() {
    this.productService.getCategories().subscribe(
      categories => {
        const brands = new Set();
        categories.categories.forEach(category => {
          brands.add(category.trim());
        });
        const arr = Array.from(brands);
        this.brandsOne = arr.filter((_, idx) => !((idx) % 3));
        this.brandsOne.forEach((item, idx) => {
          this.searchForm.addControl(`${item}`, new FormControl(false));
        });
        this.brandsTwo = arr.filter((item, idx) => !((idx) % 3 - 1));
        this.brandsTwo.forEach((item, idx) => {
          this.searchForm.addControl(`${item}`, new FormControl(false));
        });
        this.brandsThree = arr.filter((item, idx) => !((idx) % 3 - 2));
        this.brandsThree.forEach((item, idx) => {
          this.searchForm.addControl(`${item}`, new FormControl(false));
        });
      },
      (err) => {
        this.toastrService.error('Ошибка ', err);
      }
    );
  }

  removeProduct(key: string) {
    this.productService.deleteProduct(key);
  }

  addFavourite(product: Product) {
    this.productService.addFavouriteProduct(product);
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }

  onSubmitSearch() {
    const value = this.searchForm.value;
    if (value.searchQ && value.searchQ.trim() &&
      !(this.snapshot && this.snapshot.searchQ && value.searchQ.trim() === this.snapshot.searchQ.trim())) {
      this.getAllProducts(value.searchQ.trim());
      this.showReset = true;
    }
    this.selectedBrand = Object.entries(value).filter((item) => item[1] === true).map((item) => item[0]);
    if (value.searchQ && value.searchQ.trim() || this.selectedBrand.length) {
      this.showReset = true;
    }
    this.snapshot = value;
  }

  onReset() {
    this.searchForm.reset();
    this.showReset = false;
    this.getAllProducts('');
  }
}
