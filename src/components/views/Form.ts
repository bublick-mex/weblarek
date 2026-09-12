import { ensureElement} from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { TFormErrors } from "../../types";

interface IForm {
  valid: boolean;
  errors: TFormErrors | '';
}

export abstract class Form<T = object> extends Component<IForm & T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor (protected events: IEvents ,protected container: HTMLFormElement) {
    super (container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);


    this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submitted`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}