import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface IPreviewCard {
  description: string;
  category: string;
  image: string;
  buttonText: string;
  buttonDisabled: boolean;
}

interface IPreviewCardAction {
  onBasket: () => void;
  onClick?: () => void;
}

export class PreviewCard extends Card<IPreviewCard> {
  protected cardDescription: HTMLElement;
  protected cardBascetButton: HTMLButtonElement;
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, actions?: IPreviewCardAction) {
    super(container);

    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardBascetButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onBasket) {
      this.cardBascetButton.addEventListener('click', (event) => {
        event.stopPropagation();
        actions.onBasket();
      });
    }
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set category(value: string) {
    this.cardCategory.textContent = value
  
    Object.values(categoryMap).forEach((modifierClass) => {
      this.cardCategory.classList.remove(modifierClass);
    })
  
    const categoryClass = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое'];
      
    this.cardCategory.classList.add(categoryClass);
  }
  
  set image(value: string) {
    this.cardImage.src = `${CDN_URL}${value}`
    this.cardImage.alt = 'Изображение товара'
  }

  set buttonText(value: string) {
    this.cardBascetButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardBascetButton.disabled = value;
  }
}