import Parse from 'parse';

export default class Item extends Parse.Object {

    constructor(data) {
        super('Item');

        if (data) {
            this.id = data.id;
            this.set('product', data.get('product'));
            this.price = this.product.price;
        }

        this.IVA_PERCENTAGE = 0.16;
    }

    get product() {
        return this.get('product');
    }

    set product(product) {
        this.set('product', product);
        this.price = this.product.price;
    }

    get sku() {
        return this.product.get('sku');
    }

    get description() {
        return this.product.get('description');
    }

    get quantity() {
        return this.get('quantity');
    }

    set quantity(value) {
        this.set('quantity', value);
    }

    get price() {
        return this.get('price') / 100;
    }

    set price(value) {
        this.set('price', value * 100);
    }

    get subtotals() {
        return this.price * this.quantity;
    }

    get iva() {
        return this.product.get('noIVA') ? 0 : (this.subtotals - this.discountValue) * this.IVA_PERCENTAGE;
    }

    get discount() {
        return this.get('discount') / 100;
    }

    set discount(value) {
        this.set('discount', value * 100);
    }

    get discountValue() {
        return this.subtotals * (this.discount / 100);
    }

    get totals() {
        return this.subtotals - this.discountValue + this.iva;
    }
}

Parse.Object.registerSubclass('Item', Item);
