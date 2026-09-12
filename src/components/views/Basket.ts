import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  list: HTMLElement[];
  price: number;
}

export class Basket extends Component<IBasket> {
  protected basketList: HTMLElement;
  protected basketButtonBuy: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor (container: HTMLElement, protected events: IEvents) {
    super (container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButtonBuy = ensureElement<HTMLButtonElement>('.basket__button',this.container);

    this.basketButtonBuy.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  protected set list(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.basketButtonBuy.disabled = false
    } else {
      this.basketList.replaceChildren();
      this.basketButtonBuy.disabled = true;
    }
  }
  protected set price(value: number) {
    this.basketPrice.textContent = `${value} синапсов`
  }

  render(data?: Partial<IBasket>): HTMLElement {
  super.render(data);
  return this.container;
}
}