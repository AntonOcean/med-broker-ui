import {Component, OnInit} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {AuthService} from '../../../shared/services/auth.service';
import {ProductService} from '../../../shared/services/product.service';
import {ToastrService} from 'src/app/shared/services/toastr.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList: Product[] = [];
  loading = false;
  // TODO добавить категории с продуктов
  brands = new Set(['Все']);

  selectedBrand: 'Все';
  searchQ = '';
  page = 1;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe( paramMap => {
      this.searchQ = paramMap.get('q');
      this.getAllProducts(this.searchQ);
    });
  }

  getAllProducts(query) {
    // this.spinnerService.show();
    this.loading = true;

    this.productService.getProducts(query).subscribe(
      products => {
        products.forEach(product => {
          this.productList.push(product);
          this.brands.add(product.productCategory.trim());
        });
        this.loading = false;
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
}
