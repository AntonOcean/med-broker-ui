import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Product} from '../../../shared/models/product';

@Component({
  selector: 'app-cart-calculator',
  templateUrl: './cart-calculator.component.html',
  styleUrls: ['./cart-calculator.component.scss']
})
export class CartCalculatorComponent implements OnInit, OnChanges {
  @Input() products: Product[];

  totalValue = 0;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const dataChanges: SimpleChange = changes.products;

    const products: Product[] = dataChanges.currentValue;
    this.totalValue = 0;
    products.forEach((product) => {
      this.totalValue = this.totalValue + +product.productPrice;
    });
  }

  ngOnInit() {
  }
}
