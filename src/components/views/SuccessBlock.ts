import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccessData {
  price: number;
}

interface ISuccessAction {
  onClick?: () => void;
}

export class SuccessBlock extends Component<ISuccessData> {
  protected totalPrice: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: ISuccessAction) {
    super (container);

    this.totalPrice = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
  
    if(actions?.onClick) {
      this.closeButton.addEventListener('click', actions.onClick)
    }
  }

  set price(value: number) {
    this.totalPrice.textContent = `Списано ${value} синапсов`
  }
}