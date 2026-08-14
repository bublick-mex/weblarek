import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private _products: IProduct[] = []

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    return this._products;
  }

  addProduct(product: IProduct): void {
    this._products.push(product);
    this.events.emit('cart:changed', this._products);
  }

  removeProduct(id: string): void {
    this._products = this._products.filter((item) => item.id !== id);
    this.events.emit('cart:changed', this._products);
  }

  clearCart():void {
    this._products = [];
    this.events.emit('cart:changed', this._products);
  }

  getTotalPrice(): number {
    return this._products.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getAmountProducts(): number {
    return this._products.length;
  }

  checkProduct(id: string): boolean {
    return this._products.some((item) => item.id === id);
  }
}