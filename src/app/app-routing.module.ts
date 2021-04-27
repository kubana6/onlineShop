import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { SmartphonesComponent } from './smartphones/smartphones.component';
import { ShopingCartComponent } from './shoping-cart/shoping-cart.component';
import { DetailsComponent } from './details/details.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'catalog/:product', component: SmartphonesComponent },
  { path: 'catalog/:product/:model', component: DetailsComponent },
  { path: 'cart', component: ShopingCartComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
