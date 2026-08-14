import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";
import { TFormErrors } from "../../types";

export class BuyerModel {
  private _payment: TPayment = '';
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.phone !== undefined) this._phone = data.phone;

    this.events.emit('buyer:changed', this.getData())
  }

  getData(): IBuyer {
    return {
      address: this._address,
      email: this._email,
      payment: this._payment,
      phone: this._phone
    };
  }

  clearData(): void {
    this._address = '';
    this._email = '';
    this._payment = '';
    this._phone = '';
    this.events.emit('buyer:changed', this.getData());
  }

  validate(): TFormErrors {
    const error: TFormErrors = {};

    if (!this._address) {
      error.address = 'Не выбран адрес доставки';
    }
    if (!this._email) {
      error.email = 'Не указан Email';
    }
    if (!this._payment) {
      error.payment = 'Не указан способ оплаты';
    }
    if (!this._phone) {
      error.phone = 'Не указан номер телефона';
    }

    return error;
  }
}