import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private _products: IProduct[] = [];
  private _selectedCard: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit('catalog:changed', this._products);
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find((item) => item.id === id);
  }

  setSelectedCard(product: IProduct): void {
    this._selectedCard = product;
    this.events.emit('card:selected', this._selectedCard);
  }

  getSelectedCard(): IProduct | null {
    return this._selectedCard;
  }
}