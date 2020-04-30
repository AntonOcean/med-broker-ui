import {Product} from '../../../../shared/models/product';
import {ProductService} from '../../../../shared/services/product.service';
import {Component, OnInit} from '@angular/core';
import * as Jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {ToastrService} from '../../../../shared/services/toastr.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../shared/services/auth.service';
import {CheckOutService} from '../../../../shared/services/checkout.service';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  products: Product[];
  date: number;
  totalPrice = 0;
  tax = 6.4;

  constructor(
    private productService: ProductService,
    private toastService: ToastrService,
    private router: Router,
    private userService: AuthService,
    private title: CheckOutService
    ) {
    this.title.changeMessage('Заказ');
    /* Hiding Billing Tab Element */
    document.getElementById('productsTab').style.display = 'none';
    // document.getElementById('shippingTab').style.display = 'none';
    document.getElementById('billingTab').style.display = 'none';
    document.getElementById('resultTab').style.display = 'block';

    this.products = productService.getLocalCartProducts();

    this.products.forEach((product) => {
      this.totalPrice = this.totalPrice + +product.productPrice;
    });

    this.date = Date.now();
  }

  ngOnInit() {
  }

  downloadReceipt() {
    const data = document.getElementById('receipt');
    // console.log(data);

    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      // const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      // const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new Jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('med-broker-receipt.pdf'); // Generated PDF
    });
  }

  billing() {
    const products: Product[] = this.productService.getLocalCartProducts();
    const servs = [];
    products.forEach((item) => {
      servs.push({serv_id: item.$key});
    });
    const data = {
      client_id: this.userService.getLoggedInUser().createdOn,
      servs
    };
    this.productService.createOrder(data).subscribe(r => {
      this.toastService.success('Поздравляем!', 'Вы успешно оформили заказ');
      this.productService.removeAllLocalCartProduct();
      this.router.navigate(['/']);
    },
      err => {
      this.toastService.success('Поздравляем!', 'Вы успешно оформили заказ, заказ не залогирован :(');
      this.productService.removeAllLocalCartProduct();
      this.router.navigate(['/']);
      });
  }
}
