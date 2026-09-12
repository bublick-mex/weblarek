import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IContactForm {
  email: string;
  phone: string;
}

export class ContactForm extends Form<IContactForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor (protected events: IEvents, protected container: HTMLFormElement) {
    super (events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]',this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:changed', {
        field: 'email',
        value: this.emailInput.value,
      });
    });
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:changed', {
        field: 'phone',
        value: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}