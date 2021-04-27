import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICart, IGoods, IProducts, IUser } from '../types';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private crud: CrudService) {}

  public cartProduct$: BehaviorSubject<IGoods[] | null> = new BehaviorSubject<IGoods[]>(null);

  public user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser>(null);

  private _cartProduct: IGoods[] = [];

  private _user: IUser | null;

  public currentProducts$: BehaviorSubject<IProducts[] | null> = new BehaviorSubject<IProducts[]>(null);

  private _currentProducts: IProducts[];

  public authData$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private _authData: any;

  public get currentProduct() {
    return this._currentProducts;
  }

  public set currentProducts(products: IProducts[]) {
    this._currentProducts = products;
    this.currentProducts$.next(this._currentProducts);
  }

  public get cartProduct(): any {
    return this._cartProduct;
  }

  public set cartProduct(_cartProduct: any) {
    this._cartProduct.push(_cartProduct);
    this.cartProduct$.next(this._cartProduct);
  }

  public get user(): any {
    return this._user;
  }

  public set user(_user: any) {
    this._user = _user;
    this.user$.next(this._user);
  }

  public get authData(): any {
    return this.authData;
  }

  public set authData(_authData: any) {
    this._authData = _authData;
    this.authData$.next(this._authData);
  }

  public set clearData(obj: {}) {
    this.authData = {};
    this.user = {};
  }

  public buy(product: IProducts): void {
    const carts = this.user.cart;
    const currentBuy = carts.filter((element) => element.id === product.id);
    const cart =
      currentBuy.length > 0
        ? carts.map((order) => {
            if (order.id === product.id) {
              order.amount = (+order.amount + 1).toString();
              order.totalOrder = (+order.totalOrder + +product.price).toString();
            }
            return order;
          })
        : [
            ...carts,
            { id: product.id, amount: '1', totalOrder: product.price, price: product.price, name: product.name },
          ];
    this.crud.updateObject('users', this.user.id, { cart }, true).subscribe((value) => {});
  }
}
