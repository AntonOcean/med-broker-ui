import {Component, OnInit} from '@angular/core';
import {CheckOutService} from '../../../../shared/services/checkout.service';

@Component({
  selector: 'app-checkout-navbar',
  templateUrl: './checkout-navbar.component.html',
  styleUrls: ['./checkout-navbar.component.scss']
})
export class CheckoutNavbarComponent implements OnInit {
  currentTitle = '';

  constructor(private checkoutService: CheckOutService) {
  }

  ngOnInit() {
    this.checkoutService.currentMessage.subscribe(title =>
    this.currentTitle = title);
  }
}
