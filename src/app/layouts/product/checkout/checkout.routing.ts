import {CheckoutComponent} from './checkout.component';
import {ResultComponent} from './result/result.component';
import {BillingDetailsComponent} from './billing-details/billing-details.component';
import {ProductsComponent} from './products/products.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/services/auth_gaurd';
import {SuggestComponent} from './suggest/suggest.component';

export const checkoutRoutes: Routes = [
  {
    path: 'checkouts',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SuggestComponent,
        outlet: 'checkOutlet'
      },
      {
        path: 'confirm',
        component: ProductsComponent,
        outlet: 'checkOutlet'
      },
      // {
      //   path: 'shipping-details',
      //   component: ShippingDetailsComponent,
      //   outlet: 'checkOutlet'
      // },
      {
        path: 'billing-details',
        component: BillingDetailsComponent,
        outlet: 'checkOutlet'
      },
      {
        path: 'result',
        component: ResultComponent,
        outlet: 'checkOutlet'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(checkoutRoutes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule {
}
