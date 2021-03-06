import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CrudService } from '../services/crud.service';
import { ICart, IGoods, IUser } from '../types';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit, OnDestroy {
  public product: any;

  private getProductData: Subscription;

  private user: IUser;

  constructor(private crud: CrudService, private storage: StorageService) {}

  @Input() item: ICart;

  ngOnInit(): void {
    this.getProductData = this.crud.getObjectByRef('smartphones', this.item.id).subscribe((value: IGoods) => {
      this.product = value;
    });
    this.storage.user$.subscribe((value: IUser) => {
      this.user = value;
    });
  }

  public delete(): void {
    const { id, cart } = this.user;
    const newCart = cart.filter((element) => element.id !== this.item.id);
    this.crud.updateObject('users', id, { cart: newCart }, true);
  }

  ngOnDestroy(): void {
    this.getProductData.unsubscribe();
  }

  public updateAmount(type: string): void {
    if (this.item.amount === '1' && type === 'remove') {
      this.delete();
      return;
    }
    const cart = this.user.cart.map((value) => {
      if (value.id === this.item.id) {
        switch (type) {
          case 'remove': {
            const data = { ...value };
            data.amount = (+value.amount - 1).toString();
            data.totalOrder = (+data.totalOrder - +data.price).toString();
            return data;
          }
          case 'add': {
            const data = { ...value };
            data.amount = (+value.amount + 1).toString();
            data.totalOrder = (+data.totalOrder + +data.price).toString();
            return data;
          }
          default: {
            return value;
          }
        }
      }
      return value;
    });
    this.crud.updateObject('users', this.user.id, { cart }, true).subscribe((value) => {});
  }
}
