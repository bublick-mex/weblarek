import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface IProductCard {
  category: string;
  image: string;
}

interface IProductCardAction { 
  onClick: (event: MouseEvent) => void; 
}


export class ProductCard extends Card<IProductCard>{
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor (container: HTMLElement, actions?: IProductCardAction) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
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
}