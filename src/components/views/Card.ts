import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard {
  title: string;
  price: number | null;
}

export abstract class Card<T = object> extends Component<ICard & T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor (container: HTMLElement) {
    super(container);

    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
  }

  protected set title(value: string) {
    this.cardTitle.textContent = value;
  }

  protected set price(value: number | null) {
    this.cardPrice.textContent = value !== null ? `${value} синапсов` : `Бесценно`
  }
}