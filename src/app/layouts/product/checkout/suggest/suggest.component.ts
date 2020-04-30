import {Product} from '../../../../shared/models/product';
import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../../shared/services/product.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {ToastrService} from '../../../../shared/services/toastr.service';
import {Router} from '@angular/router';
import {CheckOutService} from '../../../../shared/services/checkout.service';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
})
export class SuggestComponent implements OnInit {
  suggestProducts = [];
  loader = true;

  constructor(private productService: ProductService,
              userService: AuthService,
              private toastrService: ToastrService,
              private router: Router,
              private title: CheckOutService) {
    this.title.changeMessage('Рекомендации');
    // document.getElementById('shippingTab').style.display = 'none';
    document.getElementById('billingTab').style.display = 'none';
    document.getElementById('resultTab').style.display = 'none';

    const products: Product[] = productService.getLocalCartProducts();
    const servs = [];
    products.forEach((item) => {
      servs.push({serv_id: item.$key});
    });
    const data = {
      client_id: userService.getLoggedInUser().createdOn,
      servs
    };

    productService.getSuggest(data).subscribe(
      resp => {
        if (!resp.suggests.length) {
          this.router.navigate(['checkouts', {outlets: {checkOutlet: ['confirm']}}]);
        }

        resp.suggests.forEach(item => {
          productService.getProductById(item.serv_id).subscribe(
            product => {
              this.suggestProducts.push({product, message: item.message});
            },
            (err) => {
              this.toastrService.error('Ошибка Продукт', err);
            }
          );
        });
        this.loader = false;
      },
      (err) => {
        this.toastrService.error('Ошибка Рекомендации', err);
        this.router.navigate(['checkouts', {outlets: {checkOutlet: ['confirm']}}]);
      }
    );

  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }

  ngOnInit() {
  }
}
