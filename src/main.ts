import './scss/styles.scss';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';

import { Basket } from './components/views/Basket';
import { BasketCard } from './components/views/BasketCard';
import { ContactForm } from './components/views/ContactForm';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/OrederForm';
import { PreviewCard } from './components/views/PreviewCard';
import { ProductCard } from './components/views/ProductCard';
import { SuccessBlock } from './components/views/SuccessBlock';

import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment } from './types';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const appApi = new LarekApi(baseApi);

const catalog = new CatalogModel(events);
const card = new CartModel(events);
const buyer = new BuyerModel(events);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('.modal'));

const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const contact = new ContactForm(events, cloneTemplate<HTMLFormElement>('#contacts'));
const order = new OrderForm(events, cloneTemplate<HTMLFormElement>('#order'));

const success = new SuccessBlock(cloneTemplate<HTMLElement>('#success'), {
  onClick: () => modal.close(),
});

events.onAll(({ eventName }) => console.log('Событие:', eventName));

events.on('catalog:changed', () => {
  const cards = catalog.getProducts().map((item) =>
    new ProductCard(cloneTemplate<HTMLElement>('#card-catalog')).render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image
    })
  );
  cards.forEach((cardElement, index) => {
    const item = catalog.getProducts()[index];
    cardElement.addEventListener('click', () => events.emit('card:selected', item))
  });

  gallery.render({catalog: cards})
})

events.on('card:selected', (item: IProduct) => {
  const inCart = card.getProducts().some((cartItem) => cartItem.id === item.id);

  let buttonText = inCart ? 'Удалить из корзины' : 'Купить';
  if (item.price === null || undefined) {
    buttonText = 'Недоступно'
  }

  const preview = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), {
    onBasket: () => {
      if (inCart) {
        card.removeProduct(item.id);
      } else {
        card.addProduct(item);
      }
      modal.close();
    }
  });

  modal.render({
    content: preview.render({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      buttonText: buttonText,
      buttonDisabled: item.price === null,
    }),
  });
});

events.on('basked:open', () => {
  modal.render({
    content: basket.render()
  })
})

events.on('cart:changed', () => {
  header.counter = card.getAmountProducts();

  const items = card.getProducts().map((item, index) => {
    return new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), {
      onDelete: () => card.removeProduct(item.id)
    }).render({
      index: index + 1,
      price: item.price,
      title: item.title
    });
  });
  basket.render({
      list: items,
      price: card.getTotalPrice()
    })
})

events.on('order:open', () => {
  buyer.clearData();
  modal.render({
    content: order.render({
      address: '',
      payment: null,
      valid: false,
      errors: '',
    })
  })
})

events.on('form:changed', (data: { field: string; value: string }) => {
  buyer.setData({[data.field]: data.value})
}); 

events.on('buyer:changed', () => {
  const errors = buyer.validate();
  const data = buyer.getData();

  order.render({
    address: data.address,
    payment: data.payment,
    valid: !errors.address && !errors.payment,
    errors: errors.address || errors.payment || '',
  })

  contact.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || '',
  })
})

events.on('order:submitted', () => {
  modal.render({
    content: contact.render({
      email: '',
      phone: '',
      valid: false,
      errors: '',
    })
  })
})

events.on('contacts:submitted', () => {
  const order = {
    ...buyer.getData(),
    total: card.getTotalPrice(),
    items: card.getProducts().map(item => item.id),
  }

  appApi.orderProducts(order).then((result) => {
  card.clearCart(); 
  buyer.clearData();

    modal.render({
    content: success.render({
      price: result.total,
    })
  });
}).catch((err) => {
  console.log('Ошибка при оформлении заказа', err)
})
})

appApi.getProductList().then((data) => {
  catalog.setProducts(data.items);
  console.log('массив товаров полученный с сервера: ', catalog.getProducts())
  }).catch((error) => {
    console.error('Проблема с загрузкой товаров с сервера', error);
  })