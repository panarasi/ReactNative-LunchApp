import { food, wine } from './data.json';

class Service {
  search(term, type) {
    let searchRegEx = new RegExp(term, 'i');
    if (type === 'Food') {
      return Promise.resolve(food.filter(({ name }) => searchRegEx.test(name)));
    } else {
      return Promise.resolve(wine.filter(({ name }) => searchRegEx.test(name)));
    }
  }
  getDefault(type, count = 10) {
    if (type === 'Food') {
      return Promise.resolve(food.slice(0, count));
    } else {
      return Promise.resolve(wine.slice(0, count));
    }
  }
}

export class Bill {
  constructor(price, tips) {
    this.price = price;
    this.tips = tips;
  }

  calculateCost() {
    this.tax = this.price * 0.3;
    this.discount = -this.price * 0.05;
  }

  calculateSubTotal() {
    this.calculateCost();
    this.subtotal = this.price + this.tax + this.tips + this.discount
  }

  calculateSurcharge() {
    let surcharge = this.price * 0.3;
    this.surcharge = this.tips ? 0 : surcharge;
  }

  calculateTotal() {
    this.calculateSubTotal();
    this.calculateSurcharge();
    this.total = this.subtotal + this.surcharge;
  }

  calculateChargedTotal() {
    this.calculateTotal();
    this.chargedTotal = this.total.toFixed(0);
  }

  get() {
    return {
      price: this.price,
      discount: this.discount,
      tax: this.tax,
      tips: this.tips,
      subtotal: this.subtotal,
      surcharge: this.surcharge,
      total: this.total,
      chargedTotal: this.chargedTotal
    }
  }
}

export default new Service();