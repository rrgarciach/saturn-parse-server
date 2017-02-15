import Parse from 'parse';

export default class Product extends Parse.Object {

    constructor(data) {
        super('Product');

        if (data) {
            this.id = data.id;
        }
    }

    get price() {
        return this.get('price') / 100;
    }

    set price(value) {
        this.set('price', value * 100);
    }

}

Parse.Object.registerSubclass('Product', Product);
