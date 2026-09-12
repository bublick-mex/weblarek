import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { TPayment } from "../../types";

interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButton: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(events, container);

    this.paymentButton = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    
    this.paymentButton.forEach((button) => {
      button.addEventListener('click', () => {
    this.events.emit('form:changed', { field: 'payment', value: button.name });
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:changed', {
        field: 'address',
        value: this.addressInput.value,
      });
    });
  }

  set payment(value: TPayment | null) {
    this.paymentButton.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    })
  }
  set address(value: string) {
    this.addressInput.value = value;
  }
}