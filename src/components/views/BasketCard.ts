import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

interface IBasketCard {
  index: number;
}

interface IBasketCardActions {
  onDelete?: () => void;
}

export class BasketCard extends Card<IBasketCard> {
  protected cardButtonDelete: HTMLButtonElement;
  protected cardIndex: HTMLElement;

  constructor (container: HTMLElement, actions?: IBasketCardActions) {
    super(container);

    this.cardButtonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);

    if (actions?.onDelete) {
      this.cardButtonDelete.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}