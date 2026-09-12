import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private products: IProduct[] = []

  constructor(protected events: IEvents) {}

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
    this.events.emit('cart:changed');
  }

  removeProduct(id: string): void {
    this.products = this.products.filter((item) => item.id !== id);
    this.events.emit('cart:changed');
  }

  clearCart():void {
    this.products = [];
    this.events.emit('cart):changed');
  }

  getTotalPrice(): number {
    return this.products.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getAmountProducts(): number {
    return this.products.length;
  }

  checkProduct(id: string): boolean {
    return this.products.some((item) => item.id === id);
  }
}