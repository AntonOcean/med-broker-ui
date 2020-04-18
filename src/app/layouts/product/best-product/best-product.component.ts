import {TranslateService} from 'src/app/shared/services/translate.service';
import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/shared/models/product';
import {ProductService} from 'src/app/shared/services/product.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-best-product',
  templateUrl: './best-product.component.html',
  styleUrls: ['./best-product.component.scss']
})
export class BestProductComponent implements OnInit {
  bestProducts: Product[] = [];
  options: OwlOptions;
  loading = false;

  constructor(
    private productService: ProductService,
    private toasterService: ToastrService,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.options = {
      dots: false,
      responsive: {
        0: {items: 1, margin: 20},
        430: {items: 2, margin: 20},
        550: {items: 3, margin: 20},
        670: {items: 4, margin: 20}
      },
      autoplay: true,
      loop: true,
      autoplayTimeout: 3000,
      lazyLoad: true
    };
    this.getAllProducts();
  }

  getAllProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe(
      products => {
        products.forEach(product => {
          this.bestProducts.push(product);
        });
        this.loading = false;
      },
      (err) => {
        this.toasterService.error('Ошибка ', err);
      }
    );
  }

  addFavourite(product: Product) {
    this.productService.addFavouriteProduct(product);
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }
}
